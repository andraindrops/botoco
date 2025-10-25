import { z } from "zod";

export const entityZodSchema = z.object({
  id: z.string(),
  mail: z.string().optional(),
  displayName: z.string().optional(),
});

export type entitySchema = z.infer<typeof entityZodSchema>;
