import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { UserCreateNestedOneWithoutBasesInputObjectSchema as UserCreateNestedOneWithoutBasesInputObjectSchema } from './UserCreateNestedOneWithoutBasesInput.schema';
import { TableCreateNestedManyWithoutBaseInputObjectSchema as TableCreateNestedManyWithoutBaseInputObjectSchema } from './TableCreateNestedManyWithoutBaseInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutBasesInputObjectSchema),
  tables: z.lazy(() => TableCreateNestedManyWithoutBaseInputObjectSchema).optional()
}).strict();
export const BaseCreateInputObjectSchema: z.ZodType<Prisma.BaseCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.BaseCreateInput>;
export const BaseCreateInputObjectZodSchema = makeSchema();
