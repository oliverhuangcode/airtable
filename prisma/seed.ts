import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, FieldType } from "../generated/prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env");
}

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

async function main() {
  // ─── Clean slate ─────────────────────────────────────────────────────────
  await prisma.record.deleteMany();
  await prisma.field.deleteMany();
  await prisma.view.deleteMany();
  await prisma.table.deleteMany();
  await prisma.base.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Cleared existing data");

  // ─── Users ───────────────────────────────────────────────────────────────
  const [alice, bob] = await Promise.all([
    prisma.user.create({ data: { name: "Alice Johnson", email: "alice@example.com" } }),
    prisma.user.create({ data: { name: "Bob Smith",     email: "bob@example.com"   } }),
  ]);

  console.log("👤 Created 2 users");

  // ─── Bases ───────────────────────────────────────────────────────────────
  const [crmBase, projectBase, hiringBase] = await Promise.all([
    prisma.base.create({ data: { name: "CRM",             createdById: alice.id } }),
    prisma.base.create({ data: { name: "Project Tracker", createdById: alice.id } }),
    prisma.base.create({ data: { name: "Hiring Pipeline", createdById: bob.id   } }),
  ]);

  console.log("📦 Created 3 bases");

  // ─── Tables ──────────────────────────────────────────────────────────────
  const [contactsTable, dealsTable, tasksTable, candidatesTable] = await Promise.all([
    prisma.table.create({ data: { name: "Contacts",   baseId: crmBase.id,     order: 0 } }),
    prisma.table.create({ data: { name: "Deals",      baseId: crmBase.id,     order: 1 } }),
    prisma.table.create({ data: { name: "Tasks",      baseId: projectBase.id, order: 0 } }),
    prisma.table.create({ data: { name: "Candidates", baseId: hiringBase.id,  order: 0 } }),
  ]);

  console.log("📋 Created 4 tables");

  // ─── Fields ──────────────────────────────────────────────────────────────
  const [cName, cEmail, cCompany, cScore] = await Promise.all([
    prisma.field.create({ data: { name: "Name",       type: FieldType.TEXT,   tableId: contactsTable.id, order: 0 } }),
    prisma.field.create({ data: { name: "Email",      type: FieldType.TEXT,   tableId: contactsTable.id, order: 1 } }),
    prisma.field.create({ data: { name: "Company",    type: FieldType.TEXT,   tableId: contactsTable.id, order: 2 } }),
    prisma.field.create({ data: { name: "Lead Score", type: FieldType.NUMBER, tableId: contactsTable.id, order: 3 } }),
  ]);

  const [dName, dValue, dStage] = await Promise.all([
    prisma.field.create({ data: { name: "Deal Name", type: FieldType.TEXT,   tableId: dealsTable.id, order: 0 } }),
    prisma.field.create({ data: { name: "Value",     type: FieldType.NUMBER, tableId: dealsTable.id, order: 1 } }),
    prisma.field.create({ data: { name: "Stage",     type: FieldType.TEXT,   tableId: dealsTable.id, order: 2 } }),
  ]);

  const [tTitle, tStatus, tPriority] = await Promise.all([
    prisma.field.create({ data: { name: "Title",    type: FieldType.TEXT,   tableId: tasksTable.id, order: 0 } }),
    prisma.field.create({ data: { name: "Status",   type: FieldType.TEXT,   tableId: tasksTable.id, order: 1 } }),
    prisma.field.create({ data: { name: "Priority", type: FieldType.NUMBER, tableId: tasksTable.id, order: 2 } }),
  ]);

  const [candName, candRole, candSalary, candStage] = await Promise.all([
    prisma.field.create({ data: { name: "Name",   type: FieldType.TEXT,   tableId: candidatesTable.id, order: 0 } }),
    prisma.field.create({ data: { name: "Role",   type: FieldType.TEXT,   tableId: candidatesTable.id, order: 1 } }),
    prisma.field.create({ data: { name: "Salary", type: FieldType.NUMBER, tableId: candidatesTable.id, order: 2 } }),
    prisma.field.create({ data: { name: "Stage",  type: FieldType.TEXT,   tableId: candidatesTable.id, order: 3 } }),
  ]);

  console.log("🔲 Created fields");

  // ─── Records (JSON blob per row) ─────────────────────────────────────────
  await prisma.record.createMany({
    data: [
      { tableId: contactsTable.id, order: 0, data: { [cName.id]: "Jordan Lee",   [cEmail.id]: "jordan@acme.com",    [cCompany.id]: "Acme Corp", [cScore.id]: 92 } },
      { tableId: contactsTable.id, order: 1, data: { [cName.id]: "Morgan Chen",  [cEmail.id]: "morgan@techwave.io", [cCompany.id]: "TechWave",  [cScore.id]: 74 } },
      { tableId: contactsTable.id, order: 2, data: { [cName.id]: "Riley Park",   [cEmail.id]: "riley@growth.co",   [cCompany.id]: "GrowthLab", [cScore.id]: 41 } },
      { tableId: contactsTable.id, order: 3, data: { [cName.id]: "Sam Torres",   [cEmail.id]: "sam@novainc.com",   [cCompany.id]: "Nova Inc",  [cScore.id]: 18 } },
      { tableId: contactsTable.id, order: 4, data: { [cName.id]: "Casey Wright", [cEmail.id]: "casey@bright.com",  [cCompany.id]: "BrightCo",  [cScore.id]: 55 } },

      { tableId: dealsTable.id, order: 0, data: { [dName.id]: "Acme Enterprise", [dValue.id]: 48000, [dStage.id]: "Closed Won"  } },
      { tableId: dealsTable.id, order: 1, data: { [dName.id]: "TechWave Pilot",  [dValue.id]: 12000, [dStage.id]: "Negotiation" } },
      { tableId: dealsTable.id, order: 2, data: { [dName.id]: "GrowthLab Start", [dValue.id]: 3600,  [dStage.id]: "Proposal"    } },
      { tableId: dealsTable.id, order: 3, data: { [dName.id]: "Nova Expansion",  [dValue.id]: 22000, [dStage.id]: "Qualified"   } },

      { tableId: tasksTable.id, order: 0, data: { [tTitle.id]: "Set up monorepo",      [tStatus.id]: "Done",        [tPriority.id]: 1 } },
      { tableId: tasksTable.id, order: 1, data: { [tTitle.id]: "Design system tokens", [tStatus.id]: "In Progress", [tPriority.id]: 1 } },
      { tableId: tasksTable.id, order: 2, data: { [tTitle.id]: "Write API tests",      [tStatus.id]: "Todo",        [tPriority.id]: 2 } },
      { tableId: tasksTable.id, order: 3, data: { [tTitle.id]: "Deploy staging",       [tStatus.id]: "In Review",   [tPriority.id]: 1 } },
      { tableId: tasksTable.id, order: 4, data: { [tTitle.id]: "Accessibility audit",  [tStatus.id]: "Todo",        [tPriority.id]: 3 } },

      { tableId: candidatesTable.id, order: 0, data: { [candName.id]: "Priya Nair",    [candRole.id]: "Senior Backend Engineer", [candSalary.id]: 165000, [candStage.id]: "Onsite"       } },
      { tableId: candidatesTable.id, order: 1, data: { [candName.id]: "Marcus Webb",   [candRole.id]: "Product Designer",        [candSalary.id]: 130000, [candStage.id]: "Phone Screen" } },
      { tableId: candidatesTable.id, order: 2, data: { [candName.id]: "Aisha Okonkwo", [candRole.id]: "Engineering Manager",     [candSalary.id]: 210000, [candStage.id]: "Offer"        } },
      { tableId: candidatesTable.id, order: 3, data: { [candName.id]: "Leo Huang",     [candRole.id]: "Frontend Engineer",       [candSalary.id]: 120000, [candStage.id]: "Rejected"     } },
    ],
  });

  console.log(`
✅ Seed complete:
   👤 2 users
   📦 3 bases
   📋 4 tables
   🔲 14 fields
   📄 18 records
  `);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });