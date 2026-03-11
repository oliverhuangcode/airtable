import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BaseCreateNestedManyWithoutCreatedByInputObjectSchema as BaseCreateNestedManyWithoutCreatedByInputObjectSchema } from './BaseCreateNestedManyWithoutCreatedByInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  createdAt: z.coerce.date().optional(),
  bases: z.lazy(() => BaseCreateNestedManyWithoutCreatedByInputObjectSchema).optional()
}).strict();
export const UserCreateInputObjectSchema: z.ZodType<Prisma.UserCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateInput>;
export const UserCreateInputObjectZodSchema = makeSchema();
