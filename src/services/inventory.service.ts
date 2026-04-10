import { prisma } from '../lib/prisma';
import { Tool, ToolItem } from '@prisma/client';

export const inventoryService = {
  /**
   * Fetch all tools in the inventory.
   */
  async getAllTools() {
    return prisma.tool.findMany({
      include: {
        toolItems: {
          orderBy: { itemNumber: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  },

  /**
   * Fetch specifically available numbered items for a given tool catalog entry.
   */
  async getAvailableToolItems(toolId: string): Promise<ToolItem[]> {
    return prisma.toolItem.findMany({
      where: {
        toolId,
        status: 'AVAILABLE',
      },
      orderBy: { itemNumber: 'asc' },
    });
  },

  /**
   * Add a new tool type to the inventory and auto-generate numbered items.
   */
  async addTool(data: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tool> {
    return prisma.$transaction(async (tx) => {
      const tool = await tx.tool.create({ data });
      if (tool.totalQuantity > 0) {
        const toolItems = Array.from({ length: tool.totalQuantity }).map((_, i) => ({
          toolId: tool.id,
          itemNumber: `#${i + 1}`,
          status: 'AVAILABLE' as const,
        }));
        await tx.toolItem.createMany({ data: toolItems });
      }
      return tool;
    }, { maxWait: 15000, timeout: 30000 });
  },

  /**
   * Update the total quantity of a tool (e.g., buying new stock).
   * Auto-generates missing ToolItems if quantity is increased.
   */
  async updateToolQuantity(toolId: string, newTotalQuantity: number): Promise<Tool> {
    return prisma.$transaction(async (tx) => {
      const tool = await tx.tool.findUnique({ 
        where: { id: toolId },
        include: { toolItems: true } 
      });
      if (!tool) throw new Error('Tool not found');

      const difference = newTotalQuantity - tool.totalQuantity;
      const newAvailable = Math.max(0, tool.availableQuantity + difference);

      if (difference > 0) {
        const existingCount = tool.toolItems.length;
        const newItems = Array.from({ length: difference }).map((_, i) => ({
          toolId: tool.id,
          itemNumber: `#${existingCount + i + 1}`,
          status: 'AVAILABLE' as const,
        }));
        await tx.toolItem.createMany({ data: newItems });
      }

      return tx.tool.update({
        where: { id: toolId },
        data: {
          totalQuantity: newTotalQuantity,
          availableQuantity: newAvailable,
        },
      });
    }, { maxWait: 15000, timeout: 30000 });
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
   * Low-level method to decrement/increment the available stock count.
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

  /**
   * Get a high-level summary of the inventory and current rentals for the dashboard.
   */
  async getDashboardStats() {
    const [totalTools, tools] = await Promise.all([
      prisma.tool.count(),
      prisma.tool.findMany({ select: { totalQuantity: true, availableQuantity: true } })
    ]);

    const totalQuantity = tools.reduce((acc, t) => acc + t.totalQuantity, 0);
    const availableQuantity = tools.reduce((acc, t) => acc + t.availableQuantity, 0);
    const rentedQuantity = totalQuantity - availableQuantity;

    // Get today's returns (Rentals with status ACTIVE and expected returns today if we had a return date, or just returns processed today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayReturns = await prisma.rental.count({
      where: {
        status: 'RETURNED',
        returnedAt: { gte: today }
      }
    });

    return {
      totalTools: totalQuantity,
      availableTools: availableQuantity,
      rentedTools: rentedQuantity,
      todayReturns
    };
  },
};
