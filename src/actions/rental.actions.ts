'use server';

import { rentalService, CreateRentalParams } from '../services/rental.service';
import { billingService } from '../services/billing.service';
import { cloudinaryService } from '../lib/cloudinary';
import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createRentalAction(
  params: Omit<CreateRentalParams, 'customer'> & {
    customer: Omit<CreateRentalParams['customer'], 'photoUrl'>;
  },
  photoBase64?: string
) {
  try {
    let photoUrl = undefined;
    
    if (photoBase64) {
      photoUrl = await cloudinaryService.uploadBase64Image(photoBase64, 'customers');
    }

    const fullParams: CreateRentalParams = {
      ...params,
      customer: {
        ...params.customer,
        ...(photoUrl ? { photoUrl } : {}),
      },
    };

    const rental = await rentalService.createRental(fullParams);
    
    revalidatePath('/rentals/active');
    revalidatePath('/inventory');
    revalidatePath('/dashboard');
    
    return { success: true, data: rental };
  } catch (error: any) {
    console.error('createRentalAction Error:', error);
    return { success: false, error: error.message || 'Failed to create rental' };
  }
}

export async function getActiveRentalsAction() {
  try {
    const rentals = await prisma.rental.findMany({
      where: { status: 'ACTIVE' },
      include: {
        customer: true,
        rentalItems: {
          include: { 
            tool: true,
            details: { include: { toolItem: true } }
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: rentals };
  } catch (error: any) {
    console.error('getActiveRentalsAction Error:', error);
    return { success: false, error: error.message || 'Failed to fetch active rentals' };
  }
}

export async function getRentalByIdAction(rentalId: string) {
  try {
    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
      include: {
        customer: true,
        rentalItems: {
          include: { 
            tool: true,
            details: { include: { toolItem: true } }
          },
        },
        payments: true,
      },
    });
    return { success: true, data: rental };
  } catch (error: any) {
    console.error('getRentalByIdAction Error:', error);
    return { success: false, error: error.message || 'Failed to fetch rental' };
  }
}

export async function completeRentalAction(rentalId: string) {
  try {
    const result = await billingService.completeRental(rentalId);
    
    revalidatePath('/rentals/active');
    revalidatePath('/history');
    revalidatePath('/inventory');
    revalidatePath('/dashboard');
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error('completeRentalAction Error:', error);
    return { success: false, error: error.message || 'Failed to complete rental' };
  }
}

export async function getRentalHistoryAction(timeFilter: string = 'All Time', searchQuery: string = '') {
  try {
    let dateFilter = {};
    const now = new Date();
    
    if (timeFilter === 'Today') {
      const start = new Date(now.setHours(0,0,0,0));
      dateFilter = { gte: start };
    } else if (timeFilter === 'This Week') {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0,0,0,0);
      dateFilter = { gte: start };
    } else if (timeFilter === 'This Month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { gte: start };
    }

    const whereClause: any = { status: 'RETURNED' };
    
    if (timeFilter !== 'All Time') {
      whereClause.returnedAt = dateFilter;
    }

    if (searchQuery) {
      whereClause.OR = [
        { customer: { name: { contains: searchQuery, mode: 'insensitive' } } },
        { customer: { mobile: { contains: searchQuery } } }
      ];
    }
    const rentals = await prisma.rental.findMany({
      where: whereClause,
      include: {
        customer: true,
        rentalItems: {
          include: { 
            tool: true,
            details: { include: { toolItem: true } }
          },
        },
        payments: true,
      },
      orderBy: { returnedAt: 'desc' },
    });
    
    const summary = rentals.reduce((acc, r) => ({
      transactions: acc.transactions + 1,
      totalEarned: acc.totalEarned + (r.totalAmount || 0)
    }), { transactions: 0, totalEarned: 0 });

    return { success: true, data: rentals, summary };
  } catch (error: any) {
    console.error('getRentalHistoryAction Error:', error);
    return { success: false, error: error.message || 'Failed to fetch history' };
  }
}
export async function getTodayTasksAction() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeRentals = await prisma.rental.findMany({
      where: { status: 'ACTIVE' },
      include: {
        customer: true,
        rentalItems: { include: { tool: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    // In a real app, we'd have an expectedReturnDate. Since we don't yet,
    // we'll treat all active rentals as "Today's Tasks" to manage.
    return { success: true, data: activeRentals };
  } catch (error: any) {
    console.error('getTodayTasksAction Error:', error);
    return { success: false, error: error.message || 'Failed to fetch today\'s tasks' };
  }
}
