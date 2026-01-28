const { PrismaClient } = require("./generated/client")
const { Pool } = require("pg")
const { PrismaPg } = require("@prisma/adapter-pg")
const bcrypt = require("bcryptjs")

const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgresql://postgres:hidilepos@localhost:5432/dsar-test" })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10)
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@dsar.com" },
    update: {},
    create: {
      email: "admin@dsar.com",
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  })
  
  console.log({ admin })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
