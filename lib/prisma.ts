import {PrismaClient} from '@prisma/client'

//factory function for new PrismaClient
const PrismaClientSingleton = () => {
    return new PrismaClient()
}

type PrismaClientSinglton = ReturnType<typeof PrismaClientSingleton>

const globalForPrisma = global as unknown as {prisma: PrismaClient | undefined};

//you only ever have one client instance per dev session 
const prisma = globalForPrisma.prisma ?? PrismaClientSingleton();
export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

