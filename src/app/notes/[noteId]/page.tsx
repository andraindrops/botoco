import * as noteAction from "@/_actions/domain/note";

import NoteForm from "@/_components/domain/note/form";

export default async function Page({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;

  const note = await noteAction.findById({
    id: noteId,
  });

  return (
    <div className="h-full min-h-0">
      <NoteForm note={note} />
    </div>
  );
}
