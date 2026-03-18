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
    itemNumbers?: string[]; // Specific numbered items selected in UI
  }[];
  expectedDays: number;
  advanceAmount: number;
  startDate?: Date; // Defaults to now
}

export const rentalService = {
  /**
   * Handles the checkout flow for a new Rental with Individual Item Tracking.
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

      // Handle Individual Item Tracking and Inventory Update
      for (const item of params.items) {
        let selectedItemIds: string[] = [];

        if (item.itemNumbers && item.itemNumbers.length > 0) {
          // Verify requested specific items
          if (item.itemNumbers.length !== item.quantity) {
             throw new Error(`Quantity mismatch for selected items on tool ID: ${item.toolId}`);
          }
          const specificItems = await tx.toolItem.findMany({
            where: {
              toolId: item.toolId,
              itemNumber: { in: item.itemNumbers },
              status: 'AVAILABLE',
            },
          });
          if (specificItems.length !== item.quantity) {
             throw new Error(`One or more requested items are currently unavailable for tool ID: ${item.toolId}`);
          }
          selectedItemIds = specificItems.map(i => i.id);
        } else {
          // Auto-assign available items (Backward Compatibility)
          const availableItems = await tx.toolItem.findMany({
            where: { toolId: item.toolId, status: 'AVAILABLE' },
            take: item.quantity,
            orderBy: { itemNumber: 'asc' },
          });
          if (availableItems.length !== item.quantity) {
            throw new Error(`Not enough available numbered items to auto-assign for tool ID: ${item.toolId}`);
          }
          selectedItemIds = availableItems.map(i => i.id);
        }

        // 1. Mark ToolItems individually as RENTED
        await tx.toolItem.updateMany({
          where: { id: { in: selectedItemIds } },
          data: { status: 'RENTED' },
        });

        // 2. Map RentalItemDetails
        const createdRentalItem = rental.rentalItems.find(ri => ri.toolId === item.toolId);
        if (createdRentalItem) {
          const detailsToCreate = selectedItemIds.map(toolItemId => ({
            rentalItemId: createdRentalItem.id,
            toolItemId,
            status: 'RENTED' as const,
          }));
          await tx.rentalItemDetail.createMany({
            data: detailsToCreate,
          });
        }

        // 3. Update Parent Catalog Tool Quantities (Decrement)
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
