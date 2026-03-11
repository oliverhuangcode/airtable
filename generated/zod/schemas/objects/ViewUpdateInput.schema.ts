import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TableUpdateOneRequiredWithoutViewsNestedInputObjectSchema as TableUpdateOneRequiredWithoutViewsNestedInputObjectSchema } from './TableUpdateOneRequiredWithoutViewsNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  filters: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  sorts: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  hiddenFields: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  table: z.lazy(() => TableUpdateOneRequiredWithoutViewsNestedInputObjectSchema).optional()
}).strict();
export const ViewUpdateInputObjectSchema: z.ZodType<Prisma.ViewUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewUpdateInput>;
export const ViewUpdateInputObjectZodSchema = makeSchema();
