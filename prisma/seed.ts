import { PrismaClient, RentalStatus, PaymentType, PaymentMethod } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Delete in reverse order of dependencies
  await prisma.activityLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.rentalItemDetail.deleteMany();
  await prisma.rentalItem.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.toolItem.deleteMany();
  await prisma.tool.deleteMany();

  console.log('Seeding the database with initial tools...');

  const toolsData = [
    { name: 'Iron Mesh (Jali - Heavy)', totalQuantity: 6, availableQuantity: 6, dailyPrice: 20.0, imageUrl: '/images/jali-mesh.png' },
    { name: 'Support Stand (Adjustable)', totalQuantity: 6, availableQuantity: 6, dailyPrice: 15.0, imageUrl: '/images/metal-stand.png' },
    { name: 'Compactor (Dimsa 5HP)', totalQuantity: 6, availableQuantity: 6, dailyPrice: 150.0, imageUrl: '/images/dimsa.jpg' },
    { name: 'Concrete Mixer (1/2 Bag)', totalQuantity: 6, availableQuantity: 6, dailyPrice: 500.0, imageUrl: '/images/concrete-mixer.jpg' },
  ];

  const tools = [];
  for (const toolData of toolsData) {
    const tool = await prisma.tool.create({ data: toolData });
    tools.push(tool);
    
    // Create ToolItems for each tool
    const toolItems = Array.from({ length: tool.totalQuantity }).map((_, i) => ({
      toolId: tool.id,
      itemNumber: `#${i + 1}`,
      status: 'AVAILABLE' as const,
    }));
    await prisma.toolItem.createMany({ data: toolItems });
  }
  console.log(`Created ${tools.length} tools with their respective items`);

  console.log('Seeding Customers...');
  const customersData = Array.from({ length: 10 }).map((_, i) => ({
    name: `Customer ${i + 1}`,
    mobile: `987654321${i}`,
    village: i % 2 === 0 ? 'Village A' : 'Village B',
  }));

  const customers = await Promise.all(
    customersData.map(customer => prisma.customer.create({ data: customer }))
  );
  console.log(`Created ${customers.length} customers`);

  console.log('Seeding Rentals...');
  const rentalsData = customers.map((customer, i) => {
    const status = i % 3 === 0 ? RentalStatus.RETURNED : i % 3 === 1 ? RentalStatus.OVERDUE : RentalStatus.ACTIVE;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (i + 1) * 2); // past dates
    
    return {
      customerId: customer.id,
      startDate: startDate,
      expectedDays: 5,
      status: status,
      advanceAmount: 500.0,
      totalAmount: status === RentalStatus.RETURNED ? 1000.0 : null,
      returnedAt: status === RentalStatus.RETURNED ? new Date() : null,
    };
  });

  const rentals = await Promise.all(
    rentalsData.map(rental => prisma.rental.create({ data: rental }))
  );
  console.log(`Created ${rentals.length} rentals`);

  console.log('Seeding Rental Items and Payments...');
  for (let i = 0; i < rentals.length; i++) {
    const rental = rentals[i];
    const tool = tools[i % tools.length];
    
    // Rental Items
    await prisma.rentalItem.create({
      data: {
        rentalId: rental.id,
        toolId: tool.id,
        quantity: 2,
        returnedQuantity: rental.status === RentalStatus.RETURNED ? 2 : 0,
        dailyPriceSnapshot: tool.dailyPrice,
      }
    });

    // Advance Payment
    await prisma.payment.create({
      data: {
        rentalId: rental.id,
        amount: rental.advanceAmount,
        type: PaymentType.ADVANCE,
        paymentMethod: i % 2 === 0 ? PaymentMethod.CASH : PaymentMethod.UPI,
      }
    });

    // Final settlement if returned
    if (rental.status === RentalStatus.RETURNED) {
      await prisma.payment.create({
        data: {
          rentalId: rental.id,
          amount: 500.0, // Remaining amount
          type: PaymentType.FINAL_SETTLEMENT,
          paymentMethod: PaymentMethod.CASH,
        }
      });
    }

    // Activity Log
    await prisma.activityLog.create({
      data: {
        action: 'RENTAL_CREATED',
        description: `Rental created for ${customers[i].name}`,
      }
    });
  }
  
  console.log('Created Rental Items, Payments, and Activity Logs');
  console.log('Database seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
