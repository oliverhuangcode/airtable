import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldCreateManyTableInputObjectSchema as FieldCreateManyTableInputObjectSchema } from './FieldCreateManyTableInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => FieldCreateManyTableInputObjectSchema), z.lazy(() => FieldCreateManyTableInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const FieldCreateManyTableInputEnvelopeObjectSchema: z.ZodType<Prisma.FieldCreateManyTableInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.FieldCreateManyTableInputEnvelope>;
export const FieldCreateManyTableInputEnvelopeObjectZodSchema = makeSchema();
