import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableCreateWithoutViewsInputObjectSchema as TableCreateWithoutViewsInputObjectSchema } from './TableCreateWithoutViewsInput.schema';
import { TableUncheckedCreateWithoutViewsInputObjectSchema as TableUncheckedCreateWithoutViewsInputObjectSchema } from './TableUncheckedCreateWithoutViewsInput.schema';
import { TableCreateOrConnectWithoutViewsInputObjectSchema as TableCreateOrConnectWithoutViewsInputObjectSchema } from './TableCreateOrConnectWithoutViewsInput.schema';
import { TableUpsertWithoutViewsInputObjectSchema as TableUpsertWithoutViewsInputObjectSchema } from './TableUpsertWithoutViewsInput.schema';
import { TableWhereUniqueInputObjectSchema as TableWhereUniqueInputObjectSchema } from './TableWhereUniqueInput.schema';
import { TableUpdateToOneWithWhereWithoutViewsInputObjectSchema as TableUpdateToOneWithWhereWithoutViewsInputObjectSchema } from './TableUpdateToOneWithWhereWithoutViewsInput.schema';
import { TableUpdateWithoutViewsInputObjectSchema as TableUpdateWithoutViewsInputObjectSchema } from './TableUpdateWithoutViewsInput.schema';
import { TableUncheckedUpdateWithoutViewsInputObjectSchema as TableUncheckedUpdateWithoutViewsInputObjectSchema } from './TableUncheckedUpdateWithoutViewsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TableCreateWithoutViewsInputObjectSchema), z.lazy(() => TableUncheckedCreateWithoutViewsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TableCreateOrConnectWithoutViewsInputObjectSchema).optional(),
  upsert: z.lazy(() => TableUpsertWithoutViewsInputObjectSchema).optional(),
  connect: z.lazy(() => TableWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TableUpdateToOneWithWhereWithoutViewsInputObjectSchema), z.lazy(() => TableUpdateWithoutViewsInputObjectSchema), z.lazy(() => TableUncheckedUpdateWithoutViewsInputObjectSchema)]).optional()
}).strict();
export const TableUpdateOneRequiredWithoutViewsNestedInputObjectSchema: z.ZodType<Prisma.TableUpdateOneRequiredWithoutViewsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUpdateOneRequiredWithoutViewsNestedInput>;
export const TableUpdateOneRequiredWithoutViewsNestedInputObjectZodSchema = makeSchema();
