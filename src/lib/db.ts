import { PrismaClient } from '@prisma/client';

// Singleton para evitar múltiplas instâncias do Prisma em desenvolvimento
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Em desenvolvimento, usar a instância global para evitar múltiplas conexões
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

declare global {
  var prisma: PrismaClient | undefined;
}
