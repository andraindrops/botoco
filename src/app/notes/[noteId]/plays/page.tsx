import * as playAction from "@/_actions/domain/play";

import PlayList from "@/_components/domain/play/list";

export default async function Page({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;

  const plays = await playAction.findMany({
    noteId,
  });

  return (
    <div className="h-full min-h-0">
      <PlayList noteId={noteId} plays={plays} />
    </div>
  );
}
