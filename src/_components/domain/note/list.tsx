"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/_lib/utils";

import type * as noteSchema from "@/_schemas/domain/note.ts";

import * as noteAction from "@/_actions/domain/note";

import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";

import {
  PlusIcon as AddIcon,
  EditIcon,
  EllipsisIcon,
  PlayIcon,
  TrashIcon as RemoveIcon,
} from "lucide-react";

export default function Component({
  notes,
  className,
  ...props
}: {
  notes: noteSchema.entitySchema[];
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();

  const handleCreate = async () => {
    const note = await noteAction.create();
  };

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="grid grid-flow-col justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="bg-[#f4f4f4]"
          onClick={handleCreate}
        >
          <AddIcon />
        </Button>
      </div>
      <div className="space-y-4">
        {notes.map((note) => {
          return (
            <div key={note.id} className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-8 text-sm">
                <Link href={`/notes/${note.id}`}>
                  <div className="truncate">{note.name}</div>
                </Link>
              </div>
              <div className="col-span-4 grid grid-flow-col justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisIcon className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="space-y-1 font-mono">
                    <DropdownMenuItem
                      onClick={() => {
                        router.push(`/notes/${note.id}`);
                      }}
                    >
                      <div className="grid grid-flow-col items-center gap-2">
                        <EditIcon />
                        <div className="text-sm">Edit</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push(`/notes/${note.id}`);
                      }}
                    >
                      <div className="grid grid-flow-col items-center gap-2">
                        <PlayIcon />
                        <div className="text-sm">Play</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        const confirmed = confirm(
                          "Are you sure you want to remove this note?",
                        );

                        if (confirmed) {
                          await noteAction.remove({ id: note.id });
                        }
                      }}
                    >
                      <div className="grid grid-flow-col items-center gap-2">
                        <RemoveIcon className="text-red-600" />
                        <div className="text-red-600 text-sm">Remove</div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
