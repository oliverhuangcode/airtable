import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableUpdateWithoutViewsInputObjectSchema as TableUpdateWithoutViewsInputObjectSchema } from './TableUpdateWithoutViewsInput.schema';
import { TableUncheckedUpdateWithoutViewsInputObjectSchema as TableUncheckedUpdateWithoutViewsInputObjectSchema } from './TableUncheckedUpdateWithoutViewsInput.schema';
import { TableCreateWithoutViewsInputObjectSchema as TableCreateWithoutViewsInputObjectSchema } from './TableCreateWithoutViewsInput.schema';
import { TableUncheckedCreateWithoutViewsInputObjectSchema as TableUncheckedCreateWithoutViewsInputObjectSchema } from './TableUncheckedCreateWithoutViewsInput.schema';
import { TableWhereInputObjectSchema as TableWhereInputObjectSchema } from './TableWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TableUpdateWithoutViewsInputObjectSchema), z.lazy(() => TableUncheckedUpdateWithoutViewsInputObjectSchema)]),
  create: z.union([z.lazy(() => TableCreateWithoutViewsInputObjectSchema), z.lazy(() => TableUncheckedCreateWithoutViewsInputObjectSchema)]),
  where: z.lazy(() => TableWhereInputObjectSchema).optional()
}).strict();
export const TableUpsertWithoutViewsInputObjectSchema: z.ZodType<Prisma.TableUpsertWithoutViewsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUpsertWithoutViewsInput>;
export const TableUpsertWithoutViewsInputObjectZodSchema = makeSchema();
