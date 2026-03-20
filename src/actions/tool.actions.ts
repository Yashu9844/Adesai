'use server';

import { inventoryService } from '../services/inventory.service';
import { cloudinaryService } from '../lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function getToolsAction() {
  try {
    const tools = await inventoryService.getAllTools();
    return { success: true, data: tools };
  } catch (error: any) {
    console.error('getToolsAction Error:', error);
    return { success: false, error: error.message || 'Failed to fetch tools' };
  }
}

export async function addToolAction(
  data: {
    name: string;
    totalQuantity: number;
    dailyPrice: number;
  },
  photoBase64?: string
) {
  try {
    let imageUrl = null;
    if (photoBase64) {
      imageUrl = await cloudinaryService.uploadBase64Image(photoBase64, 'tools');
    }

    const tool = await inventoryService.addTool({
      name: data.name,
      totalQuantity: data.totalQuantity,
      availableQuantity: data.totalQuantity,
      dailyPrice: data.dailyPrice,
      imageUrl,
    });

    revalidatePath('/inventory');
    revalidatePath('/rent/new');
    
    return { success: true, data: tool };
  } catch (error: any) {
    console.error('addToolAction Error:', error);
    return { success: false, error: error.message || 'Failed to add tool' };
  }
}
export async function getDashboardStatsAction() {
  try {
    const stats = await inventoryService.getDashboardStats();
    return { success: true, data: stats };
  } catch (error: any) {
    console.error('getDashboardStatsAction Error:', error);
    return { success: false, error: error.message || 'Failed to fetch dashboard stats' };
  }
}
