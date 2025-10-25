import { z } from "zod";

export const entityZodSchema = z.object({
  id: z.string(),
  webLink: z.string().optional(),
  from: z
    .object({
      emailAddress: z.object({
        address: z.string(),
      }),
    })
    .optional(),
  subject: z.string().optional(),
  bodyPreview: z.string().optional(),
  receivedDateTime: z.string().optional(),
});

export type entitySchema = z.infer<typeof entityZodSchema>;
