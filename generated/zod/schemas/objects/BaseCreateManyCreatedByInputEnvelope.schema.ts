import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BaseCreateManyCreatedByInputObjectSchema as BaseCreateManyCreatedByInputObjectSchema } from './BaseCreateManyCreatedByInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => BaseCreateManyCreatedByInputObjectSchema), z.lazy(() => BaseCreateManyCreatedByInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const BaseCreateManyCreatedByInputEnvelopeObjectSchema: z.ZodType<Prisma.BaseCreateManyCreatedByInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.BaseCreateManyCreatedByInputEnvelope>;
export const BaseCreateManyCreatedByInputEnvelopeObjectZodSchema = makeSchema();
