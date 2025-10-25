"use server";

import { revalidatePath } from "next/cache";

import type * as playSchema from "@/_schemas/domain/play";

import * as authService from "@/_services/app/auth";
import * as playService from "@/_services/domain/play";

export async function findMany({ noteId }: { noteId: string }) {
  const teamId = await authService.getTeamId();

  const result = await playService.findMany({ teamId, noteId });

  return result;
}

export async function findById({ noteId, id }: { noteId: string; id: string }) {
  const teamId = await authService.getTeamId();

  const result = await playService.findById({ teamId, noteId, id });

  return result;
}

export async function create({ noteId }: { noteId: string }) {
  const teamId = await authService.getTeamId();

  const result = await playService.create({ teamId, noteId });

  revalidatePath(`/note/${noteId}/plays`);
  revalidatePath(`/note/${noteId}/plays/${result.id}`);

  return result;
}

export async function update({
  noteId,
  id,
  data,
}: {
  noteId: string;
  id: string;
  data: playSchema.updateSchema;
}) {
  const teamId = await authService.getTeamId();

  const result = await playService.update({ teamId, noteId, id, data });

  revalidatePath(`/note/${noteId}/plays`);
  revalidatePath(`/note/${noteId}/plays/${id}`);

  return result;
}

export async function remove({ noteId, id }: { noteId: string; id: string }) {
  const teamId = await authService.getTeamId();

  const result = await playService.remove({ teamId, noteId, id });

  revalidatePath(`/note/${noteId}/plays`);

  return result;
}

export async function runStepById({
  noteId,
  id,
  stepId,
}: {
  noteId: string;
  id: string;
  stepId: string;
}) {
  const teamId = await authService.getTeamId();

  const result = await playService.runStepById({ teamId, noteId, id, stepId });

  revalidatePath(`/note/${noteId}/plays`);
  revalidatePath(`/note/${noteId}/plays/${id}`);

  return result;
}

export async function runStepMany({
  noteId,
  id,
}: {
  noteId: string;
  id: string;
}) {
  const teamId = await authService.getTeamId();

  const result = await playService.runStepMany({ teamId, noteId, id });

  revalidatePath(`/note/${noteId}/plays`);
  revalidatePath(`/note/${noteId}/plays/${id}`);

  return result;
}
