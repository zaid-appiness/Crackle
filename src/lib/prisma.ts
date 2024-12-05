import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Test database connection
prisma
  .$connect()
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((e) => {
    console.error("Failed to connect to the database:", e);
    process.exit(1);
  });
