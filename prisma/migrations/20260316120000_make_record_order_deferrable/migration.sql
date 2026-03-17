-- Drop the unique index and replace with a deferrable unique constraint
-- so that record reordering can shift rows without mid-transaction violations.
DROP INDEX IF EXISTS "Record_tableId_order_key";

ALTER TABLE "Record"
  ADD CONSTRAINT "Record_tableId_order_key"
    UNIQUE ("tableId", "order") DEFERRABLE INITIALLY IMMEDIATE;
