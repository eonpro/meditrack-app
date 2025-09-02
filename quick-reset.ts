// DIRECT DATABASE RESET SCRIPT
// Run this with: npx tsx quick-reset.ts

import { PrismaClient } from '@prisma/client';

// Use the Railway database URL directly
const DATABASE_URL = "postgresql://postgres:AbEYtPHsZVhAeiJqZTfjjaCLLCxUocSN@roundhouse.proxy.rlwy.net:40901/railway";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function resetInventory() {
  console.log('🔄 RESETTING ALL INVENTORY TO 0...');
  
  try {
    // Reset ALL inventory records to 0
    const result = await prisma.inventory.updateMany({
      data: {
        currentStock: 0,
      },
    });
    
    console.log(`✅ SUCCESS! Reset ${result.count} inventory records to 0`);
    
    // Show current status
    const inventories = await prisma.inventory.findMany({
      include: {
        medication: true,
        pharmacy: true,
      },
    });
    
    console.log('\n📦 INVENTORY STATUS (All should be 0):');
    inventories.forEach(inv => {
      console.log(`  ${inv.medication.code} at ${inv.pharmacy.name}: ${inv.currentStock} units`);
    });
    
    console.log('\n✨ DONE! Refresh your browser to see the changes.');
    
  } catch (error) {
    console.error('❌ ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetInventory();
