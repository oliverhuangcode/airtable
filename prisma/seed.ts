import "dotenv/config";
import { randomBytes } from "crypto";
import { faker } from "@faker-js/faker";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, FieldType } from "../generated/prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env");
}

const DEV_EMAIL = process.env.SEED_USER_EMAIL ?? "oliverwhuang@gmail.com";
const ROWS_PER_TABLE = 100_000;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.record.deleteMany();
  await prisma.field.deleteMany();
  await prisma.view.deleteMany();
  await prisma.table.deleteMany();
  await prisma.base.deleteMany();

  console.log("Cleared bases, tables, fields, records");

  const alice = await prisma.user.upsert({
    where: { email: DEV_EMAIL },
    update: {},
    create: { name: "Dev User", email: DEV_EMAIL },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: { name: "Bob Smith", email: "bob@example.com" },
  });

  console.log(`Upserted users (primary: ${alice.email})`);

  const crmBase = await prisma.base.create({
    data: { name: "CRM", createdById: alice.id },
  });
  const projectBase = await prisma.base.create({
    data: { name: "Project Tracker", createdById: alice.id },
  });
  const hiringBase = await prisma.base.create({
    data: { name: "Hiring Pipeline", createdById: bob.id },
  });

  console.log("Created 3 bases");

  const contactsTable = await prisma.table.create({
    data: { name: "Contacts", baseId: crmBase.id, order: 0 },
  });
  const dealsTable = await prisma.table.create({
    data: { name: "Deals", baseId: crmBase.id, order: 1 },
  });
  const tasksTable = await prisma.table.create({
    data: { name: "Tasks", baseId: projectBase.id, order: 0 },
  });
  const candidatesTable = await prisma.table.create({
    data: { name: "Candidates", baseId: hiringBase.id, order: 0 },
  });

  console.log("Created 4 tables");

  await prisma.field.create({
    data: {
      name: "Name",
      type: FieldType.TEXT,
      tableId: contactsTable.id,
      order: 0,
    },
  });
  await prisma.field.create({
    data: {
      name: "Email",
      type: FieldType.TEXT,
      tableId: contactsTable.id,
      order: 1,
    },
  });
  await prisma.field.create({
    data: {
      name: "Company",
      type: FieldType.TEXT,
      tableId: contactsTable.id,
      order: 2,
    },
  });
  await prisma.field.create({
    data: {
      name: "Lead Score",
      type: FieldType.NUMBER,
      tableId: contactsTable.id,
      order: 3,
    },
  });

  await prisma.field.create({
    data: {
      name: "Deal Name",
      type: FieldType.TEXT,
      tableId: dealsTable.id,
      order: 0,
    },
  });
  await prisma.field.create({
    data: {
      name: "Value",
      type: FieldType.NUMBER,
      tableId: dealsTable.id,
      order: 1,
    },
  });
  await prisma.field.create({
    data: {
      name: "Stage",
      type: FieldType.TEXT,
      tableId: dealsTable.id,
      order: 2,
    },
  });

  await prisma.field.create({
    data: {
      name: "Title",
      type: FieldType.TEXT,
      tableId: tasksTable.id,
      order: 0,
    },
  });
  await prisma.field.create({
    data: {
      name: "Status",
      type: FieldType.TEXT,
      tableId: tasksTable.id,
      order: 1,
    },
  });
  await prisma.field.create({
    data: {
      name: "Priority",
      type: FieldType.NUMBER,
      tableId: tasksTable.id,
      order: 2,
    },
  });

  await prisma.field.create({
    data: {
      name: "Name",
      type: FieldType.TEXT,
      tableId: candidatesTable.id,
      order: 0,
    },
  });
  await prisma.field.create({
    data: {
      name: "Role",
      type: FieldType.TEXT,
      tableId: candidatesTable.id,
      order: 1,
    },
  });
  await prisma.field.create({
    data: {
      name: "Salary",
      type: FieldType.NUMBER,
      tableId: candidatesTable.id,
      order: 2,
    },
  });
  await prisma.field.create({
    data: {
      name: "Stage",
      type: FieldType.TEXT,
      tableId: candidatesTable.id,
      order: 3,
    },
  });

  console.log("Created fields");

  // Fetch created fields so we can populate data blobs correctly
  const [contactFields, dealFields, taskFields, candidateFields] =
    await Promise.all([
      prisma.field.findMany({
        where: { tableId: contactsTable.id },
        orderBy: { order: "asc" },
      }),
      prisma.field.findMany({
        where: { tableId: dealsTable.id },
        orderBy: { order: "asc" },
      }),
      prisma.field.findMany({
        where: { tableId: tasksTable.id },
        orderBy: { order: "asc" },
      }),
      prisma.field.findMany({
        where: { tableId: candidatesTable.id },
        orderBy: { order: "asc" },
      }),
    ]);

  type FieldDef = { id: string; name: string; type: FieldType };

  function makeContactRow(fields: FieldDef[]): Record<string, string | number> {
    const row: Record<string, string | number> = {};
    for (const f of fields) {
      if (f.name === "Name") row[f.id] = faker.person.fullName();
      else if (f.name === "Email") row[f.id] = faker.internet.email();
      else if (f.name === "Company") row[f.id] = faker.company.name();
      else if (f.type === FieldType.NUMBER)
        row[f.id] = faker.number.int({ min: 0, max: 100 });
      else row[f.id] = faker.lorem.word();
    }
    return row;
  }

  function makeDealRow(fields: FieldDef[]): Record<string, string | number> {
    const stages = [
      "Prospecting",
      "Qualified",
      "Proposal",
      "Negotiation",
      "Closed Won",
      "Closed Lost",
    ];
    const row: Record<string, string | number> = {};
    for (const f of fields) {
      if (f.name === "Deal Name") row[f.id] = faker.company.buzzPhrase();
      else if (f.name === "Stage")
        row[f.id] = faker.helpers.arrayElement(stages);
      else if (f.type === FieldType.NUMBER)
        row[f.id] = faker.number.int({ min: 1000, max: 500000 });
      else row[f.id] = faker.lorem.word();
    }
    return row;
  }

  function makeTaskRow(fields: FieldDef[]): Record<string, string | number> {
    const statuses = ["Todo", "In Progress", "In Review", "Done", "Blocked"];
    const row: Record<string, string | number> = {};
    for (const f of fields) {
      if (f.name === "Title") row[f.id] = faker.hacker.phrase();
      else if (f.name === "Status")
        row[f.id] = faker.helpers.arrayElement(statuses);
      else if (f.type === FieldType.NUMBER)
        row[f.id] = faker.number.int({ min: 1, max: 5 });
      else row[f.id] = faker.lorem.word();
    }
    return row;
  }

  function makeCandidateRow(
    fields: FieldDef[],
  ): Record<string, string | number> {
    const stages = [
      "Applied",
      "Phone Screen",
      "Technical",
      "Onsite",
      "Offer",
      "Hired",
      "Rejected",
    ];
    const row: Record<string, string | number> = {};
    for (const f of fields) {
      if (f.name === "Name") row[f.id] = faker.person.fullName();
      else if (f.name === "Role") row[f.id] = faker.person.jobTitle();
      else if (f.name === "Stage")
        row[f.id] = faker.helpers.arrayElement(stages);
      else if (f.type === FieldType.NUMBER)
        row[f.id] = faker.number.int({ min: 60000, max: 300000 });
      else row[f.id] = faker.lorem.word();
    }
    return row;
  }

  const BATCH = 5_000;
  const now = new Date().toISOString();

  type TableConfig = {
    table: { id: string; name: string };
    fields: FieldDef[];
    makeRow: (fields: FieldDef[]) => Record<string, string | number>;
  };

  const tableConfigs: TableConfig[] = [
    { table: contactsTable, fields: contactFields, makeRow: makeContactRow },
    { table: dealsTable, fields: dealFields, makeRow: makeDealRow },
    { table: tasksTable, fields: taskFields, makeRow: makeTaskRow },
    {
      table: candidatesTable,
      fields: candidateFields,
      makeRow: makeCandidateRow,
    },
  ];

  for (const { table, fields, makeRow } of tableConfigs) {
    console.time(`Insert ${ROWS_PER_TABLE} rows into ${table.name}`);
    for (let offset = 0; offset < ROWS_PER_TABLE; offset += BATCH) {
      const count = Math.min(BATCH, ROWS_PER_TABLE - offset);
      const rows = Array.from({ length: count }, (_, i) => ({
        id: "rec_" + randomBytes(12).toString("hex"),
        tableId: table.id,
        order: offset + i,
        data: makeRow(fields),
        createdAt: now,
        updatedAt: now,
      }));

      const json = JSON.stringify(rows);
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO "Record" ("id", "tableId", "order", "data", "createdAt", "updatedAt")
        SELECT
          r->>'id',
          r->>'tableId',
          (r->>'order')::int,
          (r->'data')::jsonb,
          (r->>'createdAt')::timestamptz,
          (r->>'updatedAt')::timestamptz
        FROM json_array_elements($1::json) AS r
      `,
        json,
      );
    }

    console.timeEnd(`Insert ${ROWS_PER_TABLE} rows into ${table.name}`);
  }

  const totalRecords = tableConfigs.length * ROWS_PER_TABLE;
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
