
import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()
  try {
    const orderCount = await prisma.order.count()
    const orders = await prisma.order.findMany({
      take: 5,
      include: { service: true, tier: true }
    })
    console.log(`Total orders: ${orderCount}`)
    console.log('Last 5 orders:', JSON.stringify(orders, null, 2))
    
    const serviceCount = await prisma.service.count()
    console.log(`Total services: ${serviceCount}`)
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
