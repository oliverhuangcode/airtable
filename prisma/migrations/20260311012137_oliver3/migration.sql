/*
  Warnings:

  - You are about to drop the `Cell` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_recordId_fkey";

-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{}';

-- DropTable
DROP TABLE "Cell";
