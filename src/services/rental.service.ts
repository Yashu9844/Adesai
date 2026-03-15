import { prisma } from '../lib/prisma';
import { Customer, Rental, RentalItem } from '@prisma/client';
import { inventoryService } from './inventory.service';

export interface CreateRentalParams {
  customer: {
    name: string;
    mobile: string;
    village: string;
    photoUrl?: string; // Optional
  };
  items: {
    toolId: string;
    quantity: number;
    dailyPriceSnapshot: number;
  }[];
  expectedDays: number;
  advanceAmount: number;
  startDate?: Date; // Defaults to now
}

export const rentalService = {
  /**
   * Handles the entire checkout flow for a new Rental.
   * 1. Validates stock
   * 2. Upserts Customer
   * 3. Creates Rental + RentalItems + Payment (Advance)
   * 4. Decrements Tool Stock
   * All wrapped in a Prisma Transaction to prevent orphaned data.
   */
  async createRental(params: CreateRentalParams) {
    // 1. Pre-flight check: Ensure all tools have enough available stock
    for (const item of params.items) {
      const isAvailable = await inventoryService.checkToolAvailability(item.toolId, item.quantity);
      if (!isAvailable) {
        throw new Error(`Not enough stock available for tool ID: ${item.toolId}`);
      }
    }

    // 2. Execute massive transaction
    return prisma.$transaction(async (tx) => {
      // Upsert: Try to find existing customer by mobile, or create new
      const customer = await tx.customer.upsert({
        where: { mobile: params.customer.mobile },
        update: {
          name: params.customer.name,
          village: params.customer.village,
          ...(params.customer.photoUrl && { photoUrl: params.customer.photoUrl }),
        },
        create: {
          name: params.customer.name,
          mobile: params.customer.mobile,
          village: params.customer.village,
          photoUrl: params.customer.photoUrl,
        },
      });

      // Create the core Rental
      const rental = await tx.rental.create({
        data: {
          customerId: customer.id,
          startDate: params.startDate || new Date(),
          expectedDays: params.expectedDays,
          advanceAmount: params.advanceAmount,
          status: 'ACTIVE',
          // Nested Writes: Create RentalItems simultaneously
          rentalItems: {
            create: params.items.map((item) => ({
              toolId: item.toolId,
              quantity: item.quantity,
              dailyPriceSnapshot: item.dailyPriceSnapshot,
            })),
          },
          // Nested Writes: Record the Advance Payment Event
          ...(params.advanceAmount > 0
            ? {
                payments: {
                  create: [
                    {
                      amount: params.advanceAmount,
                      type: 'ADVANCE',
                      paymentMethod: 'CASH', // Defaulting to Cash for MVP
                    },
                  ],
                },
              }
            : {}),
        },
        include: {
          rentalItems: true,
          payments: true,
        },
      });

      // Update Inventory Quantities (Decrement)
      for (const item of params.items) {
        await tx.tool.update({
          where: { id: item.toolId },
          data: {
            availableQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Log the action (Optional audit trail)
      await tx.activityLog.create({
        data: {
          action: 'RENTAL_CREATED',
          description: `Created Rental ${rental.id} for Customer ${customer.name} with ${params.items.length} tool types.`,
        },
      });

      return rental;
    });
  },
};
