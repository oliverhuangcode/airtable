import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BaseArgsObjectSchema as BaseArgsObjectSchema } from './BaseArgs.schema';
import { FieldFindManySchema as FieldFindManySchema } from '../findManyField.schema';
import { RecordFindManySchema as RecordFindManySchema } from '../findManyRecord.schema';
import { ViewFindManySchema as ViewFindManySchema } from '../findManyView.schema';
import { TableCountOutputTypeArgsObjectSchema as TableCountOutputTypeArgsObjectSchema } from './TableCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  baseId: z.boolean().optional(),
  base: z.union([z.boolean(), z.lazy(() => BaseArgsObjectSchema)]).optional(),
  order: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  fields: z.union([z.boolean(), z.lazy(() => FieldFindManySchema)]).optional(),
  records: z.union([z.boolean(), z.lazy(() => RecordFindManySchema)]).optional(),
  views: z.union([z.boolean(), z.lazy(() => ViewFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TableCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TableSelectObjectSchema: z.ZodType<Prisma.TableSelect> = makeSchema() as unknown as z.ZodType<Prisma.TableSelect>;
export const TableSelectObjectZodSchema = makeSchema();
