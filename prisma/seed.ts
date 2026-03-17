import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, FieldType } from "../generated/prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env");
}

const DEV_EMAIL = process.env.SEED_USER_EMAIL ?? "oliverwhuang@gmail.com";
const ROWS_PER_TABLE = 100_000;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma  = new PrismaClient({ adapter });

async function main() {
  await prisma.record.deleteMany();
  await prisma.field.deleteMany();
  await prisma.view.deleteMany();
  await prisma.table.deleteMany();
  await prisma.base.deleteMany();

  console.log("Cleared bases, tables, fields, records");

  const alice = await prisma.user.upsert({
    where:  { email: DEV_EMAIL },
    update: {},
    create: { name: "Dev User", email: DEV_EMAIL },
  });

  const bob = await prisma.user.upsert({
    where:  { email: "bob@example.com" },
    update: {},
    create: { name: "Bob Smith", email: "bob@example.com" },
  });

  console.log(`Upserted users (primary: ${alice.email})`);

  const crmBase     = await prisma.base.create({ data: { name: "CRM",             createdById: alice.id } });
  const projectBase = await prisma.base.create({ data: { name: "Project Tracker", createdById: alice.id } });
  const hiringBase  = await prisma.base.create({ data: { name: "Hiring Pipeline", createdById: bob.id   } });

  console.log("Created 3 bases");

  const contactsTable   = await prisma.table.create({ data: { name: "Contacts",   baseId: crmBase.id,     order: 0 } });
  const dealsTable      = await prisma.table.create({ data: { name: "Deals",      baseId: crmBase.id,     order: 1 } });
  const tasksTable      = await prisma.table.create({ data: { name: "Tasks",      baseId: projectBase.id, order: 0 } });
  const candidatesTable = await prisma.table.create({ data: { name: "Candidates", baseId: hiringBase.id,  order: 0 } });

  console.log("Created 4 tables");

  await prisma.field.create({ data: { name: "Name",       type: FieldType.TEXT,   tableId: contactsTable.id, order: 0 } });
  await prisma.field.create({ data: { name: "Email",      type: FieldType.TEXT,   tableId: contactsTable.id, order: 1 } });
  await prisma.field.create({ data: { name: "Company",    type: FieldType.TEXT,   tableId: contactsTable.id, order: 2 } });
  await prisma.field.create({ data: { name: "Lead Score", type: FieldType.NUMBER, tableId: contactsTable.id, order: 3 } });

  await prisma.field.create({ data: { name: "Deal Name", type: FieldType.TEXT,   tableId: dealsTable.id, order: 0 } });
  await prisma.field.create({ data: { name: "Value",     type: FieldType.NUMBER, tableId: dealsTable.id, order: 1 } });
  await prisma.field.create({ data: { name: "Stage",     type: FieldType.TEXT,   tableId: dealsTable.id, order: 2 } });

  await prisma.field.create({ data: { name: "Title",    type: FieldType.TEXT,   tableId: tasksTable.id, order: 0 } });
  await prisma.field.create({ data: { name: "Status",   type: FieldType.TEXT,   tableId: tasksTable.id, order: 1 } });
  await prisma.field.create({ data: { name: "Priority", type: FieldType.NUMBER, tableId: tasksTable.id, order: 2 } });

  await prisma.field.create({ data: { name: "Name",   type: FieldType.TEXT,   tableId: candidatesTable.id, order: 0 } });
  await prisma.field.create({ data: { name: "Role",   type: FieldType.TEXT,   tableId: candidatesTable.id, order: 1 } });
  await prisma.field.create({ data: { name: "Salary", type: FieldType.NUMBER, tableId: candidatesTable.id, order: 2 } });
  await prisma.field.create({ data: { name: "Stage",  type: FieldType.TEXT,   tableId: candidatesTable.id, order: 3 } });

  console.log("Created fields");

  // Bulk insert 100k empty rows per table using raw SQL + generate_series
  // This is orders of magnitude faster than Prisma createMany for large datasets
  const tables = [contactsTable, dealsTable, tasksTable, candidatesTable];

  for (const table of tables) {
    console.time(`Insert ${ROWS_PER_TABLE} rows into ${table.name}`);
    await prisma.$executeRaw`
      INSERT INTO "Record" ("id", "tableId", "order", "data", "createdAt", "updatedAt")
      SELECT
        'rec_' || encode(gen_random_bytes(12), 'hex'),
        ${table.id},
        gs.i,
        '{}'::jsonb,
        NOW(),
        NOW()
      FROM generate_series(0, ${ROWS_PER_TABLE - 1}) AS gs(i)
    `;
    console.timeEnd(`Insert ${ROWS_PER_TABLE} rows into ${table.name}`);
  }

  const totalRecords = tables.length * ROWS_PER_TABLE;
  console.log(`
Seed complete:
   2 users (upserted)
   3 bases
   4 tables
   14 fields
   ${totalRecords.toLocaleString()} records (${ROWS_PER_TABLE.toLocaleString()} per table)
  `);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
