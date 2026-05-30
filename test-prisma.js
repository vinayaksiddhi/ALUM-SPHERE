const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
prisma.$connect()
  .then(() => {
    console.log("SUCCESS!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("ERROR:");
    console.error(e);
    process.exit(1);
  });
