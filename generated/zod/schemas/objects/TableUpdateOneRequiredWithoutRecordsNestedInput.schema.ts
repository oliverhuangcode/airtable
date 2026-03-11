import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableCreateWithoutRecordsInputObjectSchema as TableCreateWithoutRecordsInputObjectSchema } from './TableCreateWithoutRecordsInput.schema';
import { TableUncheckedCreateWithoutRecordsInputObjectSchema as TableUncheckedCreateWithoutRecordsInputObjectSchema } from './TableUncheckedCreateWithoutRecordsInput.schema';
import { TableCreateOrConnectWithoutRecordsInputObjectSchema as TableCreateOrConnectWithoutRecordsInputObjectSchema } from './TableCreateOrConnectWithoutRecordsInput.schema';
import { TableUpsertWithoutRecordsInputObjectSchema as TableUpsertWithoutRecordsInputObjectSchema } from './TableUpsertWithoutRecordsInput.schema';
import { TableWhereUniqueInputObjectSchema as TableWhereUniqueInputObjectSchema } from './TableWhereUniqueInput.schema';
import { TableUpdateToOneWithWhereWithoutRecordsInputObjectSchema as TableUpdateToOneWithWhereWithoutRecordsInputObjectSchema } from './TableUpdateToOneWithWhereWithoutRecordsInput.schema';
import { TableUpdateWithoutRecordsInputObjectSchema as TableUpdateWithoutRecordsInputObjectSchema } from './TableUpdateWithoutRecordsInput.schema';
import { TableUncheckedUpdateWithoutRecordsInputObjectSchema as TableUncheckedUpdateWithoutRecordsInputObjectSchema } from './TableUncheckedUpdateWithoutRecordsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TableCreateWithoutRecordsInputObjectSchema), z.lazy(() => TableUncheckedCreateWithoutRecordsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TableCreateOrConnectWithoutRecordsInputObjectSchema).optional(),
  upsert: z.lazy(() => TableUpsertWithoutRecordsInputObjectSchema).optional(),
  connect: z.lazy(() => TableWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TableUpdateToOneWithWhereWithoutRecordsInputObjectSchema), z.lazy(() => TableUpdateWithoutRecordsInputObjectSchema), z.lazy(() => TableUncheckedUpdateWithoutRecordsInputObjectSchema)]).optional()
}).strict();
export const TableUpdateOneRequiredWithoutRecordsNestedInputObjectSchema: z.ZodType<Prisma.TableUpdateOneRequiredWithoutRecordsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUpdateOneRequiredWithoutRecordsNestedInput>;
export const TableUpdateOneRequiredWithoutRecordsNestedInputObjectZodSchema = makeSchema();
