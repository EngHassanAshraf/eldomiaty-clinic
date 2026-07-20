import { PaymentMethod, PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL =
  process.env.SEED_ADMIN_EMAIL ?? 'admin@eldomiaty-clinic.com';

const ADMIN_PASSWORD =
  process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

const PAYMENT_NUMBER =
  process.env.SEED_PAYMENT_NUMBER ?? '01000000000';

async function main() {
  console.log('🌱 Starting database seed...');

  // Admin user
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      name: "El-Domiaty Admin",
      email: ADMIN_EMAIL,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log('✓ Admin user seeded');

  // System settings
  const settings = [
    {
      key: 'clinic_name',
      value: 'عيادة دكتور محمد الدمياطي',
    },
    {
      key: 'whatsapp_number',
      value: '+201066746007',
    },
    {
      key: 'allow_registrations',
      value: true,
    },
    {
      key: 'maintenance_mode',
      value: false,
    },
  ] as const;

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
      },
      create: {
        key: setting.key,
        value: setting.value,
      },
    });
  }

  console.log('✓ System settings seeded');

  // Payment methods
  const methods = [
    {
      method: PaymentMethod.BANK_TRANSFER,
      displayName: 'تحويل بنكي',
      accountName: 'عيادة دكتور محمد الدمياطي',
      accountNumber: PAYMENT_NUMBER,
      instructions: 'يرجى التحويل باسم العيادة ثم رفع صورة إثبات التحويل.',
      isActive: true,
    },
    {
      method: PaymentMethod.INSTAPAY,
      displayName: 'Instapay',
      accountName: 'عيادة دكتور محمد الدمياطي',
      accountNumber: PAYMENT_NUMBER,
      instructions: 'قم بالتحويل عبر Instapay ثم ارفع لقطة شاشة واضحة.',
      isActive: true,
    },
    {
      method: PaymentMethod.VODAFONE_CASH,
      displayName: 'فودافون كاش',
      accountName: 'د. محمد الدمياطي',
      accountNumber: PAYMENT_NUMBER,
      instructions: 'قم بالتحويل ثم ارفع صورة إثبات الدفع.',
      isActive: true,
    },
    {
      method: PaymentMethod.ORANGE_CASH,
      displayName: 'أورنج كاش',
      accountName: 'د. محمد الدمياطي',
      accountNumber: PAYMENT_NUMBER,
      instructions: 'قم بالتحويل ثم ارفع صورة إثبات الدفع.',
      isActive: true,
    },
    {
      method: PaymentMethod.ETISALAT_CASH,
      displayName: 'اتصالات كاش',
      accountName: 'د. محمد الدمياطي',
      accountNumber: PAYMENT_NUMBER,
      instructions: 'قم بالتحويل ثم ارفع صورة إثبات الدفع.',
      isActive: true,
    },
  ] as const;

  for (const method of methods) {
    await prisma.paymentMethodSetting.upsert({
      where: {
        method: method.method,
      },
      update: {
        displayName: method.displayName,
        accountName: method.accountName,
        accountNumber: method.accountNumber,
        instructions: method.instructions,
        isActive: method.isActive,
      },
      create: {
        method: method.method,
        displayName: method.displayName,
        accountName: method.accountName,
        accountNumber: method.accountNumber,
        instructions: method.instructions,
        isActive: method.isActive,
      },
    });
  }

  console.log('✓ Payment methods seeded');
  console.log('✅ Database seed completed successfully');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });