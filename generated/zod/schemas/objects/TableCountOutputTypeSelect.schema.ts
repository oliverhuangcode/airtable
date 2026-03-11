import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableCountOutputTypeCountFieldsArgsObjectSchema as TableCountOutputTypeCountFieldsArgsObjectSchema } from './TableCountOutputTypeCountFieldsArgs.schema';
import { TableCountOutputTypeCountRecordsArgsObjectSchema as TableCountOutputTypeCountRecordsArgsObjectSchema } from './TableCountOutputTypeCountRecordsArgs.schema';
import { TableCountOutputTypeCountViewsArgsObjectSchema as TableCountOutputTypeCountViewsArgsObjectSchema } from './TableCountOutputTypeCountViewsArgs.schema'

const makeSchema = () => z.object({
  fields: z.union([z.boolean(), z.lazy(() => TableCountOutputTypeCountFieldsArgsObjectSchema)]).optional(),
  records: z.union([z.boolean(), z.lazy(() => TableCountOutputTypeCountRecordsArgsObjectSchema)]).optional(),
  views: z.union([z.boolean(), z.lazy(() => TableCountOutputTypeCountViewsArgsObjectSchema)]).optional()
}).strict();
export const TableCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TableCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.TableCountOutputTypeSelect>;
export const TableCountOutputTypeSelectObjectZodSchema = makeSchema();
