'use server';

import { inventoryService } from '../services/inventory.service';

export async function getToolsAction() {
  try {
    const tools = await inventoryService.getAllTools();
    return { success: true, data: tools };
  } catch (error: any) {
    console.error('getToolsAction Error:', error);
    return { success: false, error: error.message || 'Failed to fetch tools' };
  }
}
