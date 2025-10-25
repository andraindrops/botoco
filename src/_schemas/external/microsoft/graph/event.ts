import { z } from "zod";

export const entityZodSchema = z.object({
  id: z.string(),
  webLink: z.string().optional(),
  subject: z.string().optional(),
  start: z
    .object({
      dateTime: z.string(),
      timeZone: z.string(),
    })
    .optional(),
  end: z
    .object({
      dateTime: z.string(),
      timeZone: z.string(),
    })
    .optional(),
  isOnlineMeeting: z.boolean().optional(),
  onlineMeeting: z
    .object({
      joinUrl: z.string().optional(),
    })
    .optional(),
});

export const createZodSchema = z.object({
  subject: z.string(),
  start: z.object({
    dateTime: z.string(),
    timeZone: z.string(),
  }),
  end: z.object({
    dateTime: z.string(),
    timeZone: z.string(),
  }),
  isOnlineMeeting: z.boolean().optional(),
});

export type entitySchema = z.infer<typeof entityZodSchema>;
export type createSchema = z.infer<typeof createZodSchema>;
