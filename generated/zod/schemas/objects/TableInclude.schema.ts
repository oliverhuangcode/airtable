import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BaseArgsObjectSchema as BaseArgsObjectSchema } from './BaseArgs.schema';
import { FieldFindManySchema as FieldFindManySchema } from '../findManyField.schema';
import { RecordFindManySchema as RecordFindManySchema } from '../findManyRecord.schema';
import { ViewFindManySchema as ViewFindManySchema } from '../findManyView.schema';
import { TableCountOutputTypeArgsObjectSchema as TableCountOutputTypeArgsObjectSchema } from './TableCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  base: z.union([z.boolean(), z.lazy(() => BaseArgsObjectSchema)]).optional(),
  fields: z.union([z.boolean(), z.lazy(() => FieldFindManySchema)]).optional(),
  records: z.union([z.boolean(), z.lazy(() => RecordFindManySchema)]).optional(),
  views: z.union([z.boolean(), z.lazy(() => ViewFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TableCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TableIncludeObjectSchema: z.ZodType<Prisma.TableInclude> = makeSchema() as unknown as z.ZodType<Prisma.TableInclude>;
export const TableIncludeObjectZodSchema = makeSchema();
