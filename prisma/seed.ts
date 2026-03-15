import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, FieldType } from "../generated/prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env");
}

const DEV_EMAIL = process.env.SEED_USER_EMAIL ?? "oliverwhuang@gmail.com";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma  = new PrismaClient({ adapter });

async function main() {
  await prisma.record.deleteMany();
  await prisma.field.deleteMany();
  await prisma.view.deleteMany();
  await prisma.table.deleteMany();
  await prisma.base.deleteMany();

  console.log("🗑️  Cleared bases, tables, fields, records");

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

  console.log(`👤 Upserted users (primary: ${alice.email})`);

  const crmBase     = await prisma.base.create({ data: { name: "CRM",             createdById: alice.id } });
  const projectBase = await prisma.base.create({ data: { name: "Project Tracker", createdById: alice.id } });
  const hiringBase  = await prisma.base.create({ data: { name: "Hiring Pipeline", createdById: bob.id   } });

  console.log("📦 Created 3 bases");

  const contactsTable   = await prisma.table.create({ data: { name: "Contacts",   baseId: crmBase.id,     order: 0 } });
  const dealsTable      = await prisma.table.create({ data: { name: "Deals",      baseId: crmBase.id,     order: 1 } });
  const tasksTable      = await prisma.table.create({ data: { name: "Tasks",      baseId: projectBase.id, order: 0 } });
  const candidatesTable = await prisma.table.create({ data: { name: "Candidates", baseId: hiringBase.id,  order: 0 } });

  console.log("📋 Created 4 tables");

  const cName    = await prisma.field.create({ data: { name: "Name",       type: FieldType.TEXT,   tableId: contactsTable.id, order: 0 } });
  const cEmail   = await prisma.field.create({ data: { name: "Email",      type: FieldType.TEXT,   tableId: contactsTable.id, order: 1 } });
  const cCompany = await prisma.field.create({ data: { name: "Company",    type: FieldType.TEXT,   tableId: contactsTable.id, order: 2 } });
  const cScore   = await prisma.field.create({ data: { name: "Lead Score", type: FieldType.NUMBER, tableId: contactsTable.id, order: 3 } });

  const dName  = await prisma.field.create({ data: { name: "Deal Name", type: FieldType.TEXT,   tableId: dealsTable.id, order: 0 } });
  const dValue = await prisma.field.create({ data: { name: "Value",     type: FieldType.NUMBER, tableId: dealsTable.id, order: 1 } });
  const dStage = await prisma.field.create({ data: { name: "Stage",     type: FieldType.TEXT,   tableId: dealsTable.id, order: 2 } });

  const tTitle    = await prisma.field.create({ data: { name: "Title",    type: FieldType.TEXT,   tableId: tasksTable.id, order: 0 } });
  const tStatus   = await prisma.field.create({ data: { name: "Status",   type: FieldType.TEXT,   tableId: tasksTable.id, order: 1 } });
  const tPriority = await prisma.field.create({ data: { name: "Priority", type: FieldType.NUMBER, tableId: tasksTable.id, order: 2 } });

  const candName   = await prisma.field.create({ data: { name: "Name",   type: FieldType.TEXT,   tableId: candidatesTable.id, order: 0 } });
  const candRole   = await prisma.field.create({ data: { name: "Role",   type: FieldType.TEXT,   tableId: candidatesTable.id, order: 1 } });
  const candSalary = await prisma.field.create({ data: { name: "Salary", type: FieldType.NUMBER, tableId: candidatesTable.id, order: 2 } });
  const candStage  = await prisma.field.create({ data: { name: "Stage",  type: FieldType.TEXT,   tableId: candidatesTable.id, order: 3 } });

  console.log("🔲 Created fields");

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
   👤 2 users (upserted)
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