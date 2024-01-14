import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// async function main() {
//     await prisma.user.create({
//       data: {
//         email: 'hello@prisma.com',
//         name: 'Rich',
//       },
//     })
//   }
// main()
//   .catch(async (e) => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })

// global.prisma = global.prisma || new PrismaClient();
// if(process.env.NODE_ENV !== 'production'){
//   global.prisma.$connect();
// }

// module.exports = global.db


const prisma = new PrismaClient()
prisma.$connect();

export default prisma;