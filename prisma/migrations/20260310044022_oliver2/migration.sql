/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Cell` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Table` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_createdById_fkey";

-- AlterTable
ALTER TABLE "Cell" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Field" DROP COLUMN "createdById";

-- AlterTable
ALTER TABLE "Record" DROP COLUMN "createdById";

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "createdById";
