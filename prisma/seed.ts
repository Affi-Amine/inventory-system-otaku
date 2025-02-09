import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean the database
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.customer.deleteMany()

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Gaming Laptop',
        description: 'High-performance gaming laptop',
        price: 1299.99,
        stock: 50,
        sku: 'LAPTOP001',
        category: 'Electronics',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse',
        price: 29.99,
        stock: 200,
        sku: 'MOUSE001',
        category: 'Accessories',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard',
        price: 149.99,
        stock: 75,
        sku: 'KEY001',
        category: 'Accessories',
      },
    }),
  ])

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '098-765-4321',
      },
    }),
  ])

  // Create orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        customerId: customers[0].id,
        status: 'DELIVERED',
        total: 1329.98,
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              price: 1299.99,
            },
            {
              productId: products[1].id,
              quantity: 1,
              price: 29.99,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        customerId: customers[1].id,
        status: 'PENDING',
        total: 149.99,
        items: {
          create: [
            {
              productId: products[2].id,
              quantity: 1,
              price: 149.99,
            },
          ],
        },
      },
    }),
  ])

  console.log({ products, customers, orders })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })