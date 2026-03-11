import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableWhereUniqueInputObjectSchema as TableWhereUniqueInputObjectSchema } from './TableWhereUniqueInput.schema';
import { TableCreateWithoutViewsInputObjectSchema as TableCreateWithoutViewsInputObjectSchema } from './TableCreateWithoutViewsInput.schema';
import { TableUncheckedCreateWithoutViewsInputObjectSchema as TableUncheckedCreateWithoutViewsInputObjectSchema } from './TableUncheckedCreateWithoutViewsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TableWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TableCreateWithoutViewsInputObjectSchema), z.lazy(() => TableUncheckedCreateWithoutViewsInputObjectSchema)])
}).strict();
export const TableCreateOrConnectWithoutViewsInputObjectSchema: z.ZodType<Prisma.TableCreateOrConnectWithoutViewsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableCreateOrConnectWithoutViewsInput>;
export const TableCreateOrConnectWithoutViewsInputObjectZodSchema = makeSchema();
