import * as playAction from "@/_actions/domain/play";

import PlayForm from "@/_components/domain/play/form";

export default async function Page({
  params,
}: {
  params: Promise<{ noteId: string; playId: string }>;
}) {
  const { noteId, playId } = await params;

  const play = await playAction.findById({
    noteId,
    id: playId,
  });

  return (
    <div className="h-full min-h-0">
      <PlayForm noteId={noteId} play={play} />
    </div>
  );
}
