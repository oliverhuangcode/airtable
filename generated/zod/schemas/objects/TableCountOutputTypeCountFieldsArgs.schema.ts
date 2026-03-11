import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldWhereInputObjectSchema as FieldWhereInputObjectSchema } from './FieldWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => FieldWhereInputObjectSchema).optional()
}).strict();
export const TableCountOutputTypeCountFieldsArgsObjectSchema = makeSchema();
export const TableCountOutputTypeCountFieldsArgsObjectZodSchema = makeSchema();
