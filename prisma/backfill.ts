import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backfillItems() {
  console.log('Starting backfill of ToolItems...');

  const tools = await prisma.tool.findMany({
    include: { toolItems: true },
  });

  let totalItemsCreated = 0;

  for (const tool of tools) {
    const existingCount = tool.toolItems.length;
    const targetCount = tool.totalQuantity;

    if (existingCount >= targetCount) {
      console.log(`Tool ${tool.name} already has ${existingCount} items. Skipping.`);
      continue;
    }

    const itemsToCreate = targetCount - existingCount;
    const startIndex = existingCount + 1;

    console.log(`Creating ${itemsToCreate} missing ToolItems for ${tool.name}...`);

    for (let i = 0; i < itemsToCreate; i++) {
        const itemNumber = `#${startIndex + i}`;
        await prisma.toolItem.create({
            data: {
                toolId: tool.id,
                itemNumber: itemNumber,
                status: 'AVAILABLE'
            }
        });
        totalItemsCreated++;
    }
  }

  console.log(`Successfully created ${totalItemsCreated} new ToolItems.`);

  console.log('Now repairing Active Rentals to ensure deterministic stock deduction...');
  const activeRentals = await prisma.rental.findMany({
    where: { status: 'ACTIVE' },
    include: { rentalItems: { include: { details: true, tool: { include: { toolItems: { where: { status: 'AVAILABLE' }, orderBy: { itemNumber: 'asc' } } } } } } }
  });

  for (const rental of activeRentals) {
      for (const item of rental.rentalItems) {
          const detailCount = item.details.length;
          const missingDetails = item.quantity - detailCount;

          if (missingDetails > 0) {
              console.log(`RentalItem ${item.id} (${item.tool.name}) needs ${missingDetails} item assignments.`);
              
              // Take the first N available items deterministically
              const availableItems = item.tool.toolItems.slice(0, missingDetails);
              
              if (availableItems.length < missingDetails) {
                 console.warn(`WARNING: Not enough available items to backfill Rental ${rental.id} for Tool ${item.tool.name}. Needs ${missingDetails}, found ${availableItems.length}. Data may be inconsistent.`);
              }

              for (const aItem of availableItems) {
                  await prisma.toolItem.update({
                      where: { id: aItem.id },
                      data: { status: 'RENTED' }
                  });
                  await prisma.rentalItemDetail.create({
                      data: {
                          rentalItemId: item.id,
                          toolItemId: aItem.id,
                          status: 'RENTED'
                      }
                  });
              }
          }
      }
  }

  console.log('Backfill process fully complete.');
}

backfillItems()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
