import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { TableFindManySchema as TableFindManySchema } from '../findManyTable.schema';
import { BaseCountOutputTypeArgsObjectSchema as BaseCountOutputTypeArgsObjectSchema } from './BaseCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  createdById: z.boolean().optional(),
  createdBy: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  tables: z.union([z.boolean(), z.lazy(() => TableFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BaseCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BaseSelectObjectSchema: z.ZodType<Prisma.BaseSelect> = makeSchema() as unknown as z.ZodType<Prisma.BaseSelect>;
export const BaseSelectObjectZodSchema = makeSchema();
