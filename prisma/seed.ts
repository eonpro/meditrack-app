import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@meditrack.com' },
    update: {},
    create: {
      email: 'admin@meditrack.com',
      password: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN',
      pharmacyAccess: ['PHARM01', 'PHARM02'], // Access to both pharmacies
    },
  });

  console.log('✅ Created admin user');

  // Create pharmacies
  const myceliumPharmacy = await prisma.pharmacy.upsert({
    where: { name: 'Mycelium Pharmacy' },
    update: {},
    create: {
      id: 'PHARM01',
      name: 'Mycelium Pharmacy',
      contact: 'George French',
      email: 'admin@myceliumpharmacy.com',
      phone: '(786) 282-7349',
      address: 'Florida, USA',
      licenses: [
        'Florida',
        'New Jersey',
        'Georgia',
        'North Carolina',
        'Pennsylvania',
        'Colorado',
        'Illinois',
        'Tennessee',
        'Arizona',
        'New York',
      ],
      paymentTerms: 'Net 7',
    },
  });

  const angelPharmacy = await prisma.pharmacy.upsert({
    where: { name: 'Angel Pharmacy' },
    update: {},
    create: {
      id: 'PHARM02',
      name: 'Angel Pharmacy',
      contact: 'Michael Ibrahim',
      email: 'management@angelpharmacy.org',
      phone: '(646) 280-9084',
      address: 'New York, USA',
      licenses: [
        'Florida',
        'Ohio',
        'North Carolina',
        'Indiana',
        'Pennsylvania',
        'Rhode Island',
        'Illinois',
        'Washington DC',
        'Georgia',
        'Alabama',
        'Arizona',
        'Hawaii',
        'Delaware',
        'Wisconsin',
        'New York',
        'Missouri',
        'Connecticut',
        'Washington',
        'Colorado',
        'Idaho',
        'Maryland',
        'New Mexico',
        'New Jersey',
      ],
      paymentTerms: 'Net 7',
    },
  });

  console.log('✅ Created pharmacies');

  // Create medications
  const medications = [
    {
      code: 'SEM25',
      name: 'SEMAGLUTIDE/CYANOCOBALAMIN (2.5mg/1mL) - 2.5mg',
      category: 'GLP-1 Agonist',
      unitCost: 30.0,
      reorderLevel: 15,
      primaryPharmacy: 'PHARM01',
    },
    {
      code: 'SEM5',
      name: 'SEMAGLUTIDE/CYANOCOBALAMIN (2.5mg/1mL) - 5mg',
      category: 'GLP-1 Agonist',
      unitCost: 40.0,
      reorderLevel: 15,
      primaryPharmacy: 'PHARM01',
    },
    {
      code: 'SEM10',
      name: 'SEMAGLUTIDE/CYANOCOBALAMIN (2.5mg/1mL) - 10mg',
      category: 'GLP-1 Agonist',
      unitCost: 70.0,
      reorderLevel: 15,
      primaryPharmacy: 'PHARM01',
    },
    {
      code: 'SEM125',
      name: 'SEMAGLUTIDE/CYANOCOBALAMIN (2.5mg/1mL) - 12.5mg',
      category: 'GLP-1 Agonist',
      unitCost: 90.0,
      reorderLevel: 15,
      primaryPharmacy: 'PHARM01',
    },
    {
      code: 'TIRZ10',
      name: 'TIRZEPATIDE/CYANOCOBALAMIN (10MG/1 MG/ML) - 10mg',
      category: 'GLP-1/GIP Agonist',
      unitCost: 60.0,
      reorderLevel: 15,
      primaryPharmacy: 'PHARM02',
    },
    {
      code: 'TIRZ20',
      name: 'TIRZEPATIDE/CYANOCOBALAMIN (10MG/2MG/ML) - 20mg',
      category: 'GLP-1/GIP Agonist',
      unitCost: 80.0,
      reorderLevel: 15,
      primaryPharmacy: 'PHARM02',
    },
    {
      code: 'TIRZ30',
      name: 'TIRZEPATIDE/CYANOCOBALAMIN (15MG/1 MG/ML) - 30mg',
      category: 'GLP-1/GIP Agonist',
      unitCost: 90.0,
      reorderLevel: 15,
      primaryPharmacy: 'PHARM02',
    },
    {
      code: 'TIRZ60',
      name: 'TIRZEPATIDE/CYANOCOBALAMIN (15MG/1 MG/ML) - 60mg',
      category: 'GLP-1/GIP Agonist',
      unitCost: 130.0,
      reorderLevel: 15,
      primaryPharmacy: 'PHARM02',
    },
  ];

  for (const med of medications) {
    const medication = await prisma.medication.upsert({
      where: { code: med.code },
      update: {},
      create: med,
    });

    // Create inventory records for both pharmacies
    // Semaglutide primarily stocked at Mycelium, Tirzepatide at Angel
    const myceliumStock = med.primaryPharmacy === 'PHARM01' ? 50 : 0;
    const angelStock = med.primaryPharmacy === 'PHARM02' ? 50 : 0;

    await prisma.inventory.upsert({
      where: {
        medicationId_pharmacyId: {
          medicationId: medication.id,
          pharmacyId: myceliumPharmacy.id,
        },
      },
      update: {},
      create: {
        medicationId: medication.id,
        pharmacyId: myceliumPharmacy.id,
        currentStock: myceliumStock,
        lastRestocked: myceliumStock > 0 ? new Date() : null,
      },
    });

    await prisma.inventory.upsert({
      where: {
        medicationId_pharmacyId: {
          medicationId: medication.id,
          pharmacyId: angelPharmacy.id,
        },
      },
      update: {},
      create: {
        medicationId: medication.id,
        pharmacyId: angelPharmacy.id,
        currentStock: angelStock,
        lastRestocked: angelStock > 0 ? new Date() : null,
      },
    });
  }

  console.log('✅ Created medications and inventory');

  // Create sample staff users
  const staffPassword = await bcrypt.hash('staff123', 10);
  
  await prisma.user.upsert({
    where: { email: 'mycelium.staff@meditrack.com' },
    update: {},
    create: {
      email: 'mycelium.staff@meditrack.com',
      password: staffPassword,
      name: 'Mycelium Staff',
      role: 'STAFF',
      pharmacyAccess: ['PHARM01'],
    },
  });

  await prisma.user.upsert({
    where: { email: 'angel.staff@meditrack.com' },
    update: {},
    create: {
      email: 'angel.staff@meditrack.com',
      password: staffPassword,
      name: 'Angel Staff',
      role: 'STAFF',
      pharmacyAccess: ['PHARM02'],
    },
  });

  // Create a pharmacy manager
  const managerPassword = await bcrypt.hash('manager123', 10);
  await prisma.user.upsert({
    where: { email: 'manager@meditrack.com' },
    update: {},
    create: {
      email: 'manager@meditrack.com',
      password: managerPassword,
      name: 'Pharmacy Manager',
      role: 'PHARMACY_MANAGER',
      pharmacyAccess: ['PHARM01', 'PHARM02'],
    },
  });

  console.log('✅ Created sample users');
  
  console.log(`
🎉 Database seeded successfully!

Test Accounts:
--------------
Admin: admin@meditrack.com / admin123
Manager: manager@meditrack.com / manager123
Mycelium Staff: mycelium.staff@meditrack.com / staff123
Angel Staff: angel.staff@meditrack.com / staff123
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
