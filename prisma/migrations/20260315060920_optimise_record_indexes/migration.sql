/*
  Warnings:

  - A unique constraint covering the columns `[tableId,order]` on the table `Record` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Record_tableId_order_key" ON "Record"("tableId", "order");
