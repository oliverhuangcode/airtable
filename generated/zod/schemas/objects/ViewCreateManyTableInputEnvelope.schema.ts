import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ViewCreateManyTableInputObjectSchema as ViewCreateManyTableInputObjectSchema } from './ViewCreateManyTableInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ViewCreateManyTableInputObjectSchema), z.lazy(() => ViewCreateManyTableInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ViewCreateManyTableInputEnvelopeObjectSchema: z.ZodType<Prisma.ViewCreateManyTableInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ViewCreateManyTableInputEnvelope>;
export const ViewCreateManyTableInputEnvelopeObjectZodSchema = makeSchema();
