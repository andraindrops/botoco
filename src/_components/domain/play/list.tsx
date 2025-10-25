"use client";

import Link from "next/link";

import { cn } from "@/_lib/utils";

import type * as playSchema from "@/_schemas/domain/play";

import * as playAction from "@/_actions/domain/play";

import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";

import {
  PlusIcon as AddIcon,
  MenuIcon,
  TrashIcon as RemoveIcon,
} from "lucide-react";

export default function Component({
  noteId,
  plays,
  className,
  ...props
}: {
  noteId: string;
  plays: playSchema.entitySchema[];
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const handleCreate = async () => {
    const play = await playAction.create({ noteId });
  };

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="grid grid-flow-col justify-end">
        <Button onClick={handleCreate}>
          <AddIcon />
          <div>Create</div>
        </Button>
      </div>
      <div className="space-y-2">
        {plays.map((play) => {
          return (
            <div
              key={play.id}
              className="grid grid-cols-12 items-center gap-2 rounded-sm p-2"
            >
              <div className="col-span-8 text-sm">
                <Link href={`/notes/${noteId}/plays/${play.id}`}>
                  <div className="truncate">{play.id}</div>
                </Link>
              </div>
              <div className="col-span-4 grid grid-flow-col justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MenuIcon className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={async () => {
                        const confirmed = confirm(
                          "Are you sure you want to remove this play?",
                        );

                        if (confirmed) {
                          await playAction.remove({
                            noteId,
                            id: play.id,
                          });
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
