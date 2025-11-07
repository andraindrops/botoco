import * as noteAction from "@/_actions/domain/note";

import NoteList from "@/_components/domain/note/list";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const notes = await noteAction.findMany();

  return (
    <div className="grid h-full min-h-0 grid-cols-[auto_1fr]">
      <div className="h-full min-h-0 w-64 bg-[#fcfcfc] p-2 px-6">
        <NoteList notes={notes} />
      </div>
      <div className="h-full min-h-0 p-2 px-6">{children}</div>
    </div>
  );
}
