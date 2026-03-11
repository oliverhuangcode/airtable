import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RecordCreateManyTableInputObjectSchema as RecordCreateManyTableInputObjectSchema } from './RecordCreateManyTableInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => RecordCreateManyTableInputObjectSchema), z.lazy(() => RecordCreateManyTableInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const RecordCreateManyTableInputEnvelopeObjectSchema: z.ZodType<Prisma.RecordCreateManyTableInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.RecordCreateManyTableInputEnvelope>;
export const RecordCreateManyTableInputEnvelopeObjectZodSchema = makeSchema();
