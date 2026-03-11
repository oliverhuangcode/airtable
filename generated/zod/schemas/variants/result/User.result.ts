import * as z from 'zod';
// prettier-ignore
export const UserResultSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    emailVerified: z.date().nullable(),
    image: z.string().nullable(),
    accounts: z.array(z.unknown()),
    sessions: z.array(z.unknown()),
    bases: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type UserResultType = z.infer<typeof UserResultSchema>;
