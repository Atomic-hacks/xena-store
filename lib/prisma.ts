import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

declare global {
  var prismaClient: PrismaClient | undefined;
}

export const prisma =
  global.prismaClient ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.DEBUG === "true" ? ["query", "error", "warn"] : ["error"],
  });

if (!process.env.DATABASE_URL) {
  logger.warn("prisma.datasource.missing");
}

if (process.env.NODE_ENV !== "production") {
  global.prismaClient = prisma;
}
