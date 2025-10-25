import * as noteAction from "@/_actions/domain/note";

import NoteList from "@/_components/domain/note/list";

export default async function Page() {
  const notes = await noteAction.findMany();

  return (
    <div className="h-full min-h-0">
      <NoteList notes={notes} />
    </div>
  );
}
