"use client";

import Link from "next/link";

import { cn } from "@/_lib/utils";

import type * as playSchema from "@/_schemas/domain/play";

import * as playAction from "@/_actions/domain/play";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/_components/ui/accordion";
import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";

import { PlayIcon, TrashIcon as RemoveIcon } from "lucide-react";

import PlayForm from "@/_components/domain/play/form";

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
          <PlayIcon />
          <div>Play</div>
        </Button>
      </div>
      <div className="space-y-2">
        {plays.map((play) => {
          return (
            <div key={play.id}>
              <Accordion type="single" collapsible>
                <AccordionItem value={play.id}>
                  <AccordionTrigger>
                    <div className="truncate">{play.id}</div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <PlayForm noteId={noteId} play={play} />
                    <div className="grid grid-flow-col justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
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
                        <RemoveIcon className="text-red-600" />
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      </div>
    </div>
  );
}
