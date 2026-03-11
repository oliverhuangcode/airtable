import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableCreateWithoutRecordsInputObjectSchema as TableCreateWithoutRecordsInputObjectSchema } from './TableCreateWithoutRecordsInput.schema';
import { TableUncheckedCreateWithoutRecordsInputObjectSchema as TableUncheckedCreateWithoutRecordsInputObjectSchema } from './TableUncheckedCreateWithoutRecordsInput.schema';
import { TableCreateOrConnectWithoutRecordsInputObjectSchema as TableCreateOrConnectWithoutRecordsInputObjectSchema } from './TableCreateOrConnectWithoutRecordsInput.schema';
import { TableWhereUniqueInputObjectSchema as TableWhereUniqueInputObjectSchema } from './TableWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TableCreateWithoutRecordsInputObjectSchema), z.lazy(() => TableUncheckedCreateWithoutRecordsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TableCreateOrConnectWithoutRecordsInputObjectSchema).optional(),
  connect: z.lazy(() => TableWhereUniqueInputObjectSchema).optional()
}).strict();
export const TableCreateNestedOneWithoutRecordsInputObjectSchema: z.ZodType<Prisma.TableCreateNestedOneWithoutRecordsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableCreateNestedOneWithoutRecordsInput>;
export const TableCreateNestedOneWithoutRecordsInputObjectZodSchema = makeSchema();
