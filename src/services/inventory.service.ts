import { prisma } from '../lib/prisma';
import { Tool } from '@prisma/client';

export const inventoryService = {
  /**
   * Fetch all tools in the inventory.
   */
  async getAllTools(): Promise<Tool[]> {
    return prisma.tool.findMany({
      orderBy: { name: 'asc' },
    });
  },

  /**
   * Add a new tool type to the inventory.
   */
  async addTool(data: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tool> {
    return prisma.tool.create({
      data,
    });
  },

  /**
   * Master override to update the total quantity of a tool (e.g., buying new stock).
   * Also adjusts the availableQuantity proportionally.
   */
  async updateToolQuantity(toolId: string, newTotalQuantity: number): Promise<Tool> {
    const tool = await prisma.tool.findUnique({ where: { id: toolId } });
    if (!tool) throw new Error('Tool not found');

    const difference = newTotalQuantity - tool.totalQuantity;
    const newAvailable = Math.max(0, tool.availableQuantity + difference);

    return prisma.tool.update({
      where: { id: toolId },
      data: {
        totalQuantity: newTotalQuantity,
        availableQuantity: newAvailable,
      },
    });
  },

  /**
   * Purely check if a tool has enough stock to be rented right now.
   * Does not mutate the database.
   */
  async checkToolAvailability(toolId: string, requestedQuantity: number): Promise<boolean> {
    const tool = await prisma.tool.findUnique({ where: { id: toolId } });
    if (!tool) throw new Error('Tool not found');

    return tool.availableQuantity >= requestedQuantity;
  },

  /**
   * Low-level method to decrement/increment the available stock.
   * Typically called by RentalService during checkout or return.
   * `amountToChange` should be negative for rentals (decreasing stock) and positive for returns.
   */
  async updateAvailableQuantity(toolId: string, amountToChange: number): Promise<Tool> {
    const tool = await prisma.tool.findUnique({ where: { id: toolId } });
    if (!tool) throw new Error('Tool not found');

    const newStock = tool.availableQuantity + amountToChange;
    if (newStock < 0 || newStock > tool.totalQuantity) {
      throw new Error(`Invalid stock change. Stock would become ${newStock}`);
    }

    return prisma.tool.update({
      where: { id: toolId },
      data: { availableQuantity: newStock },
    });
  },
};
