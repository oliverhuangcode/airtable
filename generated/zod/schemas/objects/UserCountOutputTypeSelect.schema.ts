import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { UserCountOutputTypeCountAccountsArgsObjectSchema as UserCountOutputTypeCountAccountsArgsObjectSchema } from './UserCountOutputTypeCountAccountsArgs.schema';
import { UserCountOutputTypeCountSessionsArgsObjectSchema as UserCountOutputTypeCountSessionsArgsObjectSchema } from './UserCountOutputTypeCountSessionsArgs.schema';
import { UserCountOutputTypeCountBasesArgsObjectSchema as UserCountOutputTypeCountBasesArgsObjectSchema } from './UserCountOutputTypeCountBasesArgs.schema'

const makeSchema = () => z.object({
  accounts: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeCountAccountsArgsObjectSchema)]).optional(),
  sessions: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeCountSessionsArgsObjectSchema)]).optional(),
  bases: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeCountBasesArgsObjectSchema)]).optional()
}).strict();
export const UserCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.UserCountOutputTypeSelect>;
export const UserCountOutputTypeSelectObjectZodSchema = makeSchema();
