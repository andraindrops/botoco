"use server";

import { openai } from "@ai-sdk/openai";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  convertToModelMessages,
  experimental_createMCPClient as createMCPClient,
  generateId,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type * as noteSchema from "@/_schemas/domain/note";
import * as microsoftGraphSchema from "@/_schemas/external/microsoft/graph";

import * as authService from "@/_services/app/auth";
import * as noteService from "@/_services/domain/note";

export async function findMany() {
  const teamId = await authService.getTeamId();

  const result = await noteService.findMany({ teamId });

  return result;
}

export async function findById({ id }: { id: string }) {
  const teamId = await authService.getTeamId();

  const result = await noteService.findById({ teamId, id });

  return result;
}

export async function create() {
  const teamId = await authService.getTeamId();

  const result = await noteService.create({ teamId });

  revalidatePath("/notes");

  return result;
}

export async function update({
  id,
  data,
}: {
  id: string;
  data: noteSchema.updateSchema;
}) {
  const teamId = await authService.getTeamId();

  const result = await noteService.update({ teamId, id, data });

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);

  return result;
}

export async function remove({ id }: { id: string }) {
  const teamId = await authService.getTeamId();

  const result = await noteService.remove({ teamId, id });

  revalidatePath("/notes");

  return result;
}
