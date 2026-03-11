import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableCreateWithoutFieldsInputObjectSchema as TableCreateWithoutFieldsInputObjectSchema } from './TableCreateWithoutFieldsInput.schema';
import { TableUncheckedCreateWithoutFieldsInputObjectSchema as TableUncheckedCreateWithoutFieldsInputObjectSchema } from './TableUncheckedCreateWithoutFieldsInput.schema';
import { TableCreateOrConnectWithoutFieldsInputObjectSchema as TableCreateOrConnectWithoutFieldsInputObjectSchema } from './TableCreateOrConnectWithoutFieldsInput.schema';
import { TableWhereUniqueInputObjectSchema as TableWhereUniqueInputObjectSchema } from './TableWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TableCreateWithoutFieldsInputObjectSchema), z.lazy(() => TableUncheckedCreateWithoutFieldsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TableCreateOrConnectWithoutFieldsInputObjectSchema).optional(),
  connect: z.lazy(() => TableWhereUniqueInputObjectSchema).optional()
}).strict();
export const TableCreateNestedOneWithoutFieldsInputObjectSchema: z.ZodType<Prisma.TableCreateNestedOneWithoutFieldsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableCreateNestedOneWithoutFieldsInput>;
export const TableCreateNestedOneWithoutFieldsInputObjectZodSchema = makeSchema();
