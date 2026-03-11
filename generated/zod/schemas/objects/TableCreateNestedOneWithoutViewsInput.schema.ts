import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableCreateWithoutViewsInputObjectSchema as TableCreateWithoutViewsInputObjectSchema } from './TableCreateWithoutViewsInput.schema';
import { TableUncheckedCreateWithoutViewsInputObjectSchema as TableUncheckedCreateWithoutViewsInputObjectSchema } from './TableUncheckedCreateWithoutViewsInput.schema';
import { TableCreateOrConnectWithoutViewsInputObjectSchema as TableCreateOrConnectWithoutViewsInputObjectSchema } from './TableCreateOrConnectWithoutViewsInput.schema';
import { TableWhereUniqueInputObjectSchema as TableWhereUniqueInputObjectSchema } from './TableWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TableCreateWithoutViewsInputObjectSchema), z.lazy(() => TableUncheckedCreateWithoutViewsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TableCreateOrConnectWithoutViewsInputObjectSchema).optional(),
  connect: z.lazy(() => TableWhereUniqueInputObjectSchema).optional()
}).strict();
export const TableCreateNestedOneWithoutViewsInputObjectSchema: z.ZodType<Prisma.TableCreateNestedOneWithoutViewsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableCreateNestedOneWithoutViewsInput>;
export const TableCreateNestedOneWithoutViewsInputObjectZodSchema = makeSchema();
