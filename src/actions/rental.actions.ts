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
          include: { tool: true },
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
          include: { tool: true },
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

export async function getRentalHistoryAction() {
  try {
    const rentals = await prisma.rental.findMany({
      where: { status: 'RETURNED' },
      include: {
        customer: true,
        rentalItems: {
          include: { tool: true },
        },
        payments: true,
      },
      orderBy: { returnedAt: 'desc' },
    });
    return { success: true, data: rentals };
  } catch (error: any) {
    console.error('getRentalHistoryAction Error:', error);
    return { success: false, error: error.message || 'Failed to fetch history' };
  }
}
