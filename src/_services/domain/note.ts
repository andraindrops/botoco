// import { generateHTML } from "@tiptap/html/server";
// import StarterKit from "@tiptap/starter-kit";

import db from "@/_lib/db";

import type * as noteSchema from "@/_schemas/domain/note";

export async function findMany({ teamId }: { teamId: string }) {
  const notes = await db.note.findMany({
    where: {
      teamId,
    },
    orderBy: { createdAt: "desc" },
  });

  return notes.map((note) => fromDb({ data: note }));
}

export async function findById({ teamId, id }: { teamId: string; id: string }) {
  const note = await db.note.findUniqueOrThrow({
    where: { teamId, id },
  });

  return fromDb({ data: note });
}

export async function create({ teamId }: { teamId: string }) {
  const note = await db.note.create({
    data: {
      teamId,
      name: "Untitled",
      text: "",
      code: JSON.stringify({ steps: [] }),
    },
  });

  return fromDb({ data: note });
}

export async function update({
  teamId,
  id,
  data,
}: {
  teamId: string;
  id: string;
  data: noteSchema.updateSchema;
}) {
  const note = await db.note.update({
    where: { teamId, id },
    data: {
      name: data.name,
      // text: data.text,
      code: JSON.stringify(data.code),
    },
  });

  return fromDb({ data: note });
}

export async function remove({ teamId, id }: { teamId: string; id: string }) {
  const note = await db.note.delete({
    where: { teamId, id },
  });

  return fromDb({ data: note });
}

export function fromDb({
  data,
}: {
  data: noteSchema.entityRawSchema;
}): noteSchema.entitySchema {
  const code =
    data.code !== null && data.code !== "" ? JSON.parse(data.code) : [];

  return {
    ...data,
    code,
  };
}
