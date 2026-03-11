import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableWhereInputObjectSchema as TableWhereInputObjectSchema } from './TableWhereInput.schema';
import { TableUpdateWithoutViewsInputObjectSchema as TableUpdateWithoutViewsInputObjectSchema } from './TableUpdateWithoutViewsInput.schema';
import { TableUncheckedUpdateWithoutViewsInputObjectSchema as TableUncheckedUpdateWithoutViewsInputObjectSchema } from './TableUncheckedUpdateWithoutViewsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TableWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TableUpdateWithoutViewsInputObjectSchema), z.lazy(() => TableUncheckedUpdateWithoutViewsInputObjectSchema)])
}).strict();
export const TableUpdateToOneWithWhereWithoutViewsInputObjectSchema: z.ZodType<Prisma.TableUpdateToOneWithWhereWithoutViewsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUpdateToOneWithWhereWithoutViewsInput>;
export const TableUpdateToOneWithWhereWithoutViewsInputObjectZodSchema = makeSchema();
