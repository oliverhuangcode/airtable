import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableUpdateWithoutRecordsInputObjectSchema as TableUpdateWithoutRecordsInputObjectSchema } from './TableUpdateWithoutRecordsInput.schema';
import { TableUncheckedUpdateWithoutRecordsInputObjectSchema as TableUncheckedUpdateWithoutRecordsInputObjectSchema } from './TableUncheckedUpdateWithoutRecordsInput.schema';
import { TableCreateWithoutRecordsInputObjectSchema as TableCreateWithoutRecordsInputObjectSchema } from './TableCreateWithoutRecordsInput.schema';
import { TableUncheckedCreateWithoutRecordsInputObjectSchema as TableUncheckedCreateWithoutRecordsInputObjectSchema } from './TableUncheckedCreateWithoutRecordsInput.schema';
import { TableWhereInputObjectSchema as TableWhereInputObjectSchema } from './TableWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TableUpdateWithoutRecordsInputObjectSchema), z.lazy(() => TableUncheckedUpdateWithoutRecordsInputObjectSchema)]),
  create: z.union([z.lazy(() => TableCreateWithoutRecordsInputObjectSchema), z.lazy(() => TableUncheckedCreateWithoutRecordsInputObjectSchema)]),
  where: z.lazy(() => TableWhereInputObjectSchema).optional()
}).strict();
export const TableUpsertWithoutRecordsInputObjectSchema: z.ZodType<Prisma.TableUpsertWithoutRecordsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUpsertWithoutRecordsInput>;
export const TableUpsertWithoutRecordsInputObjectZodSchema = makeSchema();
