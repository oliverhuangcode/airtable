import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableWhereUniqueInputObjectSchema as TableWhereUniqueInputObjectSchema } from './TableWhereUniqueInput.schema';
import { TableCreateWithoutRecordsInputObjectSchema as TableCreateWithoutRecordsInputObjectSchema } from './TableCreateWithoutRecordsInput.schema';
import { TableUncheckedCreateWithoutRecordsInputObjectSchema as TableUncheckedCreateWithoutRecordsInputObjectSchema } from './TableUncheckedCreateWithoutRecordsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TableWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TableCreateWithoutRecordsInputObjectSchema), z.lazy(() => TableUncheckedCreateWithoutRecordsInputObjectSchema)])
}).strict();
export const TableCreateOrConnectWithoutRecordsInputObjectSchema: z.ZodType<Prisma.TableCreateOrConnectWithoutRecordsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableCreateOrConnectWithoutRecordsInput>;
export const TableCreateOrConnectWithoutRecordsInputObjectZodSchema = makeSchema();
