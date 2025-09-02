import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Resetting all inventory to 0...');
  
  // Reset all inventory records to 0
  const result = await prisma.inventory.updateMany({
    data: {
      currentStock: 0,
    },
  });
  
  console.log(`✅ Reset ${result.count} inventory records to 0 stock`);
  
  // Get updated inventory counts for verification
  const inventories = await prisma.inventory.findMany({
    include: {
      medication: true,
      pharmacy: true,
    },
  });
  
  console.log('\n📦 Current Inventory Status:');
  inventories.forEach(inv => {
    console.log(`  ${inv.medication.code} at ${inv.pharmacy.name}: ${inv.currentStock} units`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error resetting inventory:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
