import * as noteAction from "@/_actions/domain/note";
import * as playAction from "@/_actions/domain/play";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/_components/ui/tabs";

import NoteForm from "@/_components/domain/note/form";
import PlayList from "@/_components/domain/play/list";

export default async function Page({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;

  const note = await noteAction.findById({
    id: noteId,
  });

  const plays = await playAction.findMany({
    noteId,
  });

  return (
    <div>
      <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="play">Play</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <NoteForm note={note} />
        </TabsContent>
        <TabsContent value="play">
          <PlayList noteId={noteId} plays={plays} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
