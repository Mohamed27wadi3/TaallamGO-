import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (if needed for development)
  // await db.$executeRaw`TRUNCATE TABLE ... CASCADE`

  // Create default roles
  const customerRole = await db.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: {
      name: 'CUSTOMER',
      description: 'Standard customer role',
    },
  })

  const supportRole = await db.role.upsert({
    where: { name: 'SUPPORT_AGENT' },
    update: {},
    create: {
      name: 'SUPPORT_AGENT',
      description: 'Support team member',
    },
  })

  const adminRole = await db.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrator',
    },
  })

  const operationsRole = await db.role.upsert({
    where: { name: 'OPERATIONS_AGENT' },
    update: {},
    create: {
      name: 'OPERATIONS_AGENT',
      description: 'Operations team member',
    },
  })

  console.log('✓ Roles created')

  // Create permissions
  const permissions = [
    { resource: 'orders', action: 'read' },
    { resource: 'orders', action: 'create' },
    { resource: 'orders', action: 'update' },
    { resource: 'products', action: 'read' },
    { resource: 'support', action: 'read' },
    { resource: 'support', action: 'create' },
    { resource: 'payments', action: 'read' },
    { resource: 'users', action: 'read' },
  ]

  const createdPermissions = await Promise.all(
    permissions.map(p =>
      db.permission.upsert({
        where: {
          resource_action: {
            resource: p.resource,
            action: p.action,
          },
        },
        update: {},
        create: p,
      }),
    ),
  )

  console.log('✓ Permissions created')

  // Link permissions to roles
  const ordersReadPerm = createdPermissions.find(
    p => p.resource === 'orders' && p.action === 'read',
  )
  const ordersCreatePerm = createdPermissions.find(
    p => p.resource === 'orders' && p.action === 'create',
  )
  const supportReadPerm = createdPermissions.find(
    p => p.resource === 'support' && p.action === 'read',
  )

  if (ordersReadPerm && ordersCreatePerm) {
    await db.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: customerRole.id,
          permissionId: ordersReadPerm.id,
        },
      },
      update: {},
      create: {
        roleId: customerRole.id,
        permissionId: ordersReadPerm.id,
      },
    })

    await db.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: customerRole.id,
          permissionId: ordersCreatePerm.id,
        },
      },
      update: {},
      create: {
        roleId: customerRole.id,
        permissionId: ordersCreatePerm.id,
      },
    })
  }

  console.log('✓ Role permissions linked')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123456', 10)

  const demoUser = await db.user.upsert({
    where: { email: 'demo@taallamgo.dz' },
    update: {},
    create: {
      email: 'demo@taallamgo.dz',
      name: 'Demo User',
      password: hashedPassword,
      emailVerified: new Date(),
      profile: {
        create: {
          firstName: 'Demo',
          lastName: 'User',
          phone: '+213 555 123456',
          wilaya: 'Algiers',
          language: 'fr',
          type: 'individual',
        },
      },
      userRoles: {
        create: {
          roleId: customerRole.id,
        },
      },
    },
  })

  console.log('✓ Demo user created:', demoUser.email)

  // Create platforms
  const platforms = [
    {
      name: 'Udemy',
      slug: 'udemy',
      status: 'available',
      color: '#A435F0',
      officialUrl: 'https://udemy.com',
    },
    {
      name: 'Coursera',
      slug: 'coursera',
      status: 'available',
      color: '#0056D2',
      officialUrl: 'https://coursera.org',
    },
    {
      name: 'Hack The Box',
      slug: 'htb',
      status: 'available',
      color: '#9FEF00',
      officialUrl: 'https://hackthebox.com',
    },
    {
      name: 'LinkedIn Learning',
      slug: 'linkedin',
      status: 'available',
      color: '#0A66C2',
      officialUrl: 'https://linkedin.com/learning',
    },
  ]

  const createdPlatforms = await Promise.all(
    platforms.map(p =>
      db.platform.upsert({
        where: { slug: p.slug },
        update: {},
        create: p,
      }),
    ),
  )

  console.log('✓ Platforms created')

  // Create categories
  const categories = [
    { name: 'Développement', nameAr: 'البرمجة', slug: 'dev', icon: '💻' },
    { name: 'Data & IA', nameAr: 'البيانات والذكاء الاصطناعي', slug: 'data', icon: '📊' },
    { name: 'Cybersécurité', nameAr: 'الأمن السيبراني', slug: 'security', icon: '🔐' },
    { name: 'Cloud & DevOps', nameAr: 'الحوسبة السحابية', slug: 'cloud', icon: '☁️' },
    { name: 'Design', nameAr: 'التصميم', slug: 'design', icon: '🎨' },
    { name: 'Business', nameAr: 'الأعمال', slug: 'business', icon: '📈' },
  ]

  const createdCategories = await Promise.all(
    categories.map(c =>
      db.category.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      }),
    ),
  )

  console.log('✓ Categories created')

  // Link platforms to categories
  for (const platform of createdPlatforms) {
    for (const category of createdCategories) {
      await db.platformCategory.upsert({
        where: {
          platformId_categoryId: {
            platformId: platform.id,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          platformId: platform.id,
          categoryId: category.id,
        },
      })
    }
  }

  console.log('✓ Platform-Category links created')

  // Create demo products
  const udemyPlatform = createdPlatforms.find(p => p.slug === 'udemy')
  const courseseraplatform = createdPlatforms.find(p => p.slug === 'coursera')
  const devCategory = createdCategories.find(c => c.slug === 'dev')
  const dataCategory = createdCategories.find(c => c.slug === 'data')
  const securityCategory = createdCategories.find(c => c.slug === 'security')

  if (udemyPlatform && devCategory && courseseraplatform && dataCategory && securityCategory) {
    const pythonCourse = await db.product.upsert({
      where: { slug: 'complete-python-bootcamp' },
      update: {},
      create: {
        platformId: udemyPlatform.id,
        categoryId: devCategory.id,
        slug: 'complete-python-bootcamp',
        title: 'The Complete Python Bootcamp: Zero to Hero',
        titleAr: 'دورة بايثون الشاملة: من الصفر إلى الاحتراف',
        description: 'Master Python programming from basics to advanced concepts',
        type: 'course',
        level: 'beginner',
        duration: '22h',
        instructor: 'Jose Portilla',
        certificate: true,
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=220&fit=crop&auto=format',
        officialUrl: 'https://udemy.com/course/complete-python-bootcamp/',
        prices: {
          create: {
            amountUsd: 1399, // 13.99 USD in cents
            amountDzd: 188000, // ~1880 DZD
            exchangeRate: new Decimal('134.5'),
            exchangeMargin: new Decimal('0.02'),
            feePercentage: new Decimal('0.03'),
            commissionPercentage: new Decimal('0.08'),
            verifiedAt: new Date(),
            source: 'manual',
          },
        },
      },
    })

    const mlCourse = await db.product.upsert({
      where: { slug: 'machine-learning-specialization' },
      update: {},
      create: {
        platformId: courseseraplatform.id,
        categoryId: dataCategory.id,
        slug: 'machine-learning-specialization',
        title: 'Machine Learning Specialization',
        titleAr: 'تخصص تعلم الآلة',
        description: 'Learn Machine Learning with Andrew Ng',
        type: 'subscription',
        level: 'intermediate',
        duration: '3 months',
        instructor: 'Andrew Ng',
        certificate: true,
        imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=220&fit=crop&auto=format',
        officialUrl: 'https://coursera.org/specializations/machine-learning-introduction',
        prices: {
          create: {
            amountUsd: 4900, // 49 USD in cents
            amountDzd: 660000, // ~6600 DZD
            exchangeRate: new Decimal('134.5'),
            exchangeMargin: new Decimal('0.02'),
            feePercentage: new Decimal('0.03'),
            commissionPercentage: new Decimal('0.08'),
            verifiedAt: new Date(),
            source: 'manual',
          },
        },
      },
    })

    console.log('✓ Demo products created')
  }

  console.log('✅ Database seed completed successfully!')
}

// Import Decimal for the prices
import { Decimal } from 'decimal.js'

seed()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async e => {
    console.error('❌ Seed error:', e)
    await db.$disconnect()
    process.exit(1)
  })
