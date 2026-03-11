import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BaseCreateNestedOneWithoutTablesInputObjectSchema as BaseCreateNestedOneWithoutTablesInputObjectSchema } from './BaseCreateNestedOneWithoutTablesInput.schema';
import { FieldCreateNestedManyWithoutTableInputObjectSchema as FieldCreateNestedManyWithoutTableInputObjectSchema } from './FieldCreateNestedManyWithoutTableInput.schema';
import { RecordCreateNestedManyWithoutTableInputObjectSchema as RecordCreateNestedManyWithoutTableInputObjectSchema } from './RecordCreateNestedManyWithoutTableInput.schema';
import { ViewCreateNestedManyWithoutTableInputObjectSchema as ViewCreateNestedManyWithoutTableInputObjectSchema } from './ViewCreateNestedManyWithoutTableInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  order: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  base: z.lazy(() => BaseCreateNestedOneWithoutTablesInputObjectSchema),
  fields: z.lazy(() => FieldCreateNestedManyWithoutTableInputObjectSchema).optional(),
  records: z.lazy(() => RecordCreateNestedManyWithoutTableInputObjectSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutTableInputObjectSchema).optional()
}).strict();
export const TableCreateInputObjectSchema: z.ZodType<Prisma.TableCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TableCreateInput>;
export const TableCreateInputObjectZodSchema = makeSchema();
