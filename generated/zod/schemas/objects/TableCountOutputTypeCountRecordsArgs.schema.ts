import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RecordWhereInputObjectSchema as RecordWhereInputObjectSchema } from './RecordWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RecordWhereInputObjectSchema).optional()
}).strict();
export const TableCountOutputTypeCountRecordsArgsObjectSchema = makeSchema();
export const TableCountOutputTypeCountRecordsArgsObjectZodSchema = makeSchema();
