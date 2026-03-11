import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableWhereInputObjectSchema as TableWhereInputObjectSchema } from './TableWhereInput.schema';
import { TableUpdateWithoutRecordsInputObjectSchema as TableUpdateWithoutRecordsInputObjectSchema } from './TableUpdateWithoutRecordsInput.schema';
import { TableUncheckedUpdateWithoutRecordsInputObjectSchema as TableUncheckedUpdateWithoutRecordsInputObjectSchema } from './TableUncheckedUpdateWithoutRecordsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TableWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TableUpdateWithoutRecordsInputObjectSchema), z.lazy(() => TableUncheckedUpdateWithoutRecordsInputObjectSchema)])
}).strict();
export const TableUpdateToOneWithWhereWithoutRecordsInputObjectSchema: z.ZodType<Prisma.TableUpdateToOneWithWhereWithoutRecordsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUpdateToOneWithWhereWithoutRecordsInput>;
export const TableUpdateToOneWithWhereWithoutRecordsInputObjectZodSchema = makeSchema();
