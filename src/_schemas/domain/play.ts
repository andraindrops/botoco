import { z } from "zod";

export const entityRawZodSchema = z.object({
  id: z.string(),
  noteId: z.string(),
  name: z.string(),
  // text: z.string(),
  code: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const entityZodSchema = z.object({
  id: z.string(),
  noteId: z.string(),
  name: z.string().min(1),
  // text: z.string().min(1),
  code: z.object({
    steps: z.array(
      z.object({
        name: z.string().min(1),
        text: z.string().min(1),
        tool: z.string(),
        outputSchema: z.string(), // json string
        approvalRequired: z.boolean().default(false),
        outputRecord: z.string(), // json string
        actionStatus: z.enum(["wait", "done"]),
        reviewStatus: z.enum(["wait", "accept", "reject"]),
      }),
    ),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createZodSchema = z.object({});

export const updateZodSchema = z.object({
  name: z.string().min(1),
  // text: z.string().min(1),
  code: z.object({
    steps: z.array(
      z.object({
        name: z.string().min(1),
        text: z.string().min(1),
        tool: z.string(),
        outputSchema: z.string(), // json string
        approvalRequired: z.boolean(),
        outputRecord: z.string(), // json string
        actionStatus: z.enum(["wait", "done"]),
        reviewStatus: z.enum(["wait", "accept", "reject"]),
      }),
    ),
  }),
});

export type entityRawSchema = z.infer<typeof entityRawZodSchema>;
export type entitySchema = z.infer<typeof entityZodSchema>;
export type createSchema = z.infer<typeof createZodSchema>;
export type updateSchema = z.infer<typeof updateZodSchema>;
