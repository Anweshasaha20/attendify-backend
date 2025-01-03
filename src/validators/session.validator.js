import { z } from "zod";

export const sessionSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  duration: z.number().int().positive(),
});
