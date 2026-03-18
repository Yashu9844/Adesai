import { prisma } from '../lib/prisma';
import { PaymentMethod } from '@prisma/client';

export const billingService = {
  /**
   * Calculates the rental cost based on the strict rule:
   * Even returning on the same day counts as 1 full day.
   */
  calculateRentalCost(startDate: Date, endDate: Date, dailyPrice: number, quantity: number): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Minimum 1 day rental
    const actualDays = Math.max(1, diffDays);
    
    return actualDays * dailyPrice * quantity;
  },

  /**
   * Finalizes a rental transaction:
   * 1. Calculates the final cost based on actual return date
   * 2. Deducts advance payment
   * 3. Creates FINAL_SETTLEMENT payment
   * 4. Marks Rental as RETURNED
   * 5. Returns tools to Inventory availableQuantity
   * All wrapped in a Prisma Transaction.
   */
  async completeRental(rentalId: string, paymentMethod: PaymentMethod = 'CASH') {
    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
      include: {
        rentalItems: {
          include: { details: true }
        },
        payments: true,
        customer: true,
      },
    });

    if (!rental) throw new Error('Rental not found');
    if (rental.status === 'RETURNED') throw new Error('Rental already returned');

    const returnDate = new Date();
    
    // Calculate total cost across all items using their locked daily price snapshot
    let totalComputedCost = 0;
    for (const item of rental.rentalItems) {
      const itemCost = this.calculateRentalCost(
        rental.startDate,
        returnDate,
        item.dailyPriceSnapshot,
        item.quantity
      );
      totalComputedCost += itemCost;
    }

    // Calculate remaining balance to be paid
    const totalAdvancePaid = rental.payments
      .filter((p) => p.type === 'ADVANCE')
      .reduce((sum, p) => sum + p.amount, 0);

    const finalBalanceToPay = Math.max(0, totalComputedCost - totalAdvancePaid);

    // Execute the massive return transaction
    return prisma.$transaction(async (tx) => {
      // 1. Update Rental Status
      const finalizedRental = await tx.rental.update({
        where: { id: rentalId },
        data: {
          status: 'RETURNED',
          returnedAt: returnDate,
          totalAmount: totalComputedCost,
          // 2. Create Final Payment Event (if balance > 0)
          ...(finalBalanceToPay > 0
            ? {
                payments: {
                  create: [
                    {
                      amount: finalBalanceToPay,
                      type: 'FINAL_SETTLEMENT',
                      paymentMethod: paymentMethod,
                    },
                  ],
                },
              }
            : {}),
        },
      });

      // 3. Mark Items as Returned & Replenish Stock
      for (const item of rental.rentalItems) {
        // Release specific tool items back to available pool
        if (item.details && item.details.length > 0) {
          const toolItemIds = item.details.map((d: any) => d.toolItemId);
          
          await tx.toolItem.updateMany({
            where: { id: { in: toolItemIds } },
            data: { status: 'AVAILABLE' },
          });

          await tx.rentalItemDetail.updateMany({
            where: { rentalItemId: item.id },
            data: { status: 'AVAILABLE' },
          });
        }

        // Update item returned quantity
        await tx.rentalItem.update({
          where: { id: item.id },
          data: { returnedQuantity: item.quantity },
        });

        // Replenish actual inventory stock
        await tx.tool.update({
          where: { id: item.toolId },
          data: {
            availableQuantity: {
              increment: item.quantity,
            },
          },
        });
      }

      // 4. Audit Log
      await tx.activityLog.create({
        data: {
          action: 'RENTAL_RETURNED',
          description: `Rental ${rental.id} returned by ${rental.customer.name}. Final balance paid: ₹${finalBalanceToPay}`,
        },
      });

      return {
        rental: finalizedRental,
        totalCost: totalComputedCost,
        advancePaid: totalAdvancePaid,
        balancePaid: finalBalanceToPay,
      };
    });
  },
};
