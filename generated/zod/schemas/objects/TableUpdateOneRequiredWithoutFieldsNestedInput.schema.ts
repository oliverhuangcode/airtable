import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableCreateWithoutFieldsInputObjectSchema as TableCreateWithoutFieldsInputObjectSchema } from './TableCreateWithoutFieldsInput.schema';
import { TableUncheckedCreateWithoutFieldsInputObjectSchema as TableUncheckedCreateWithoutFieldsInputObjectSchema } from './TableUncheckedCreateWithoutFieldsInput.schema';
import { TableCreateOrConnectWithoutFieldsInputObjectSchema as TableCreateOrConnectWithoutFieldsInputObjectSchema } from './TableCreateOrConnectWithoutFieldsInput.schema';
import { TableUpsertWithoutFieldsInputObjectSchema as TableUpsertWithoutFieldsInputObjectSchema } from './TableUpsertWithoutFieldsInput.schema';
import { TableWhereUniqueInputObjectSchema as TableWhereUniqueInputObjectSchema } from './TableWhereUniqueInput.schema';
import { TableUpdateToOneWithWhereWithoutFieldsInputObjectSchema as TableUpdateToOneWithWhereWithoutFieldsInputObjectSchema } from './TableUpdateToOneWithWhereWithoutFieldsInput.schema';
import { TableUpdateWithoutFieldsInputObjectSchema as TableUpdateWithoutFieldsInputObjectSchema } from './TableUpdateWithoutFieldsInput.schema';
import { TableUncheckedUpdateWithoutFieldsInputObjectSchema as TableUncheckedUpdateWithoutFieldsInputObjectSchema } from './TableUncheckedUpdateWithoutFieldsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TableCreateWithoutFieldsInputObjectSchema), z.lazy(() => TableUncheckedCreateWithoutFieldsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TableCreateOrConnectWithoutFieldsInputObjectSchema).optional(),
  upsert: z.lazy(() => TableUpsertWithoutFieldsInputObjectSchema).optional(),
  connect: z.lazy(() => TableWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TableUpdateToOneWithWhereWithoutFieldsInputObjectSchema), z.lazy(() => TableUpdateWithoutFieldsInputObjectSchema), z.lazy(() => TableUncheckedUpdateWithoutFieldsInputObjectSchema)]).optional()
}).strict();
export const TableUpdateOneRequiredWithoutFieldsNestedInputObjectSchema: z.ZodType<Prisma.TableUpdateOneRequiredWithoutFieldsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUpdateOneRequiredWithoutFieldsNestedInput>;
export const TableUpdateOneRequiredWithoutFieldsNestedInputObjectZodSchema = makeSchema();
