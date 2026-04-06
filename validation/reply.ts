import { z } from 'zod';

export const CreateReplySchema = z.object({
  content: z.string().min(1, 'Reply cannot be empty').max(10000),
  isInternal: z.boolean().default(false),
});
