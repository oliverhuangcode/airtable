import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SessionCreateNestedManyWithoutUserInputObjectSchema as SessionCreateNestedManyWithoutUserInputObjectSchema } from './SessionCreateNestedManyWithoutUserInput.schema';
import { BaseCreateNestedManyWithoutCreatedByInputObjectSchema as BaseCreateNestedManyWithoutCreatedByInputObjectSchema } from './BaseCreateNestedManyWithoutCreatedByInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputObjectSchema).optional(),
  bases: z.lazy(() => BaseCreateNestedManyWithoutCreatedByInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutAccountsInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutAccountsInput>;
export const UserCreateWithoutAccountsInputObjectZodSchema = makeSchema();
