import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableWhereUniqueInputObjectSchema as TableWhereUniqueInputObjectSchema } from './TableWhereUniqueInput.schema';
import { TableCreateWithoutFieldsInputObjectSchema as TableCreateWithoutFieldsInputObjectSchema } from './TableCreateWithoutFieldsInput.schema';
import { TableUncheckedCreateWithoutFieldsInputObjectSchema as TableUncheckedCreateWithoutFieldsInputObjectSchema } from './TableUncheckedCreateWithoutFieldsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TableWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TableCreateWithoutFieldsInputObjectSchema), z.lazy(() => TableUncheckedCreateWithoutFieldsInputObjectSchema)])
}).strict();
export const TableCreateOrConnectWithoutFieldsInputObjectSchema: z.ZodType<Prisma.TableCreateOrConnectWithoutFieldsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableCreateOrConnectWithoutFieldsInput>;
export const TableCreateOrConnectWithoutFieldsInputObjectZodSchema = makeSchema();
