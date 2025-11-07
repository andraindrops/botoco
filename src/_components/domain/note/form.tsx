"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { cn } from "@/_lib/utils";

import * as noteSchema from "@/_schemas/domain/note";

import * as noteAction from "@/_actions/domain/note";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/_components/ui/accordion";
import { Button } from "@/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Switch } from "@/_components/ui/switch";
import { Textarea } from "@/_components/ui/textarea";

import { PlusIcon, SaveIcon, XIcon } from "lucide-react";

const DEFAULT_TEXT = '[result] is "hello"';

const DEFAULT_OUTPUT_SCHEMA = `
{
  "type": "object",
  "properties": {
    "record": {
      "type": "object",
      "properties": {
        "result": {
          "type": "number"
        }
      },
      "required": [
        "result"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "record"
  ],
  "additionalProperties": false
}
`.trim();

export default function Component({
  note,
  className,
  ...props
}: {
  note: noteSchema.entitySchema;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const handleSubmit = async ({ data }: { data: noteSchema.updateSchema }) => {
    await noteAction.update({
      id: note.id,
      data: {
        name: data.name,
        code: {
          steps: data.code.steps.map((step) => {
            return {
              name: step.name,
              text: step.text,
              tool: step.tool,
              outputSchema: step.outputSchema,
              approvalRequired: step.approvalRequired,
            };
          }),
        },
      },
    });
  };

  const form = useForm<noteSchema.updateSchema>({
    resolver: zodResolver(noteSchema.updateZodSchema),
    defaultValues: {
      name: note.name,
      code: {
        steps: note.code.steps.map((step) => {
          return {
            name: step.name,
            text: step.text,
            tool: step.tool,
            outputSchema: step.outputSchema,
            approvalRequired: step.approvalRequired,
          };
        }),
      },
    },
  });
  const codeSteps = useFieldArray({
    control: form.control,
    name: "code.steps",
  });

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            await handleSubmit({
              data,
            });
          })}
          className="h-full min-h-0 space-y-4"
        >
          <div className="grid grid-flow-col justify-end">
            <Button type="submit">
              <SaveIcon />
              <div>Save</div>
            </Button>
          </div>
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} className="input-text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <section className="space-y-4">
            <div>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  codeSteps.append({
                    name: "",
                    text: DEFAULT_TEXT,
                    tool: "",
                    outputSchema: DEFAULT_OUTPUT_SCHEMA,
                    approvalRequired: false,
                  })
                }
              >
                <PlusIcon />
                <div>Add a step</div>
              </Button>
            </div>
            <div className="space-y-4">
              {codeSteps.fields.map((step, stepIndex) => (
                <div key={step.id} className="rounded-sm p-4 shadow-sm">
                  <div className="grid grid-flow-col grid-cols-12 gap-4">
                    <div className="col-span-2 space-y-4">
                      <FormField
                        control={form.control}
                        name={`code.steps.${stepIndex}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                className="input-text !px-0 !text-xs"
                                placeholder="ID"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`code.steps.${stepIndex}.approvalRequired`}
                        render={({ field }) => (
                          <FormItem>
                            <Label className="text-[10px]">Review</Label>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-9 space-y-2">
                      <FormField
                        control={form.control}
                        name={`code.steps.${stepIndex}.text`}
                        render={({ field }) => (
                          <FormItem className="bg-white">
                            <FormControl>
                              <Textarea
                                {...field}
                                className="input-text !px-0 !text-xs h-20"
                                placeholder="Prompt"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Accordion type="single" collapsible>
                        <AccordionItem value="options">
                          <AccordionTrigger className="text-[10px]">
                            Options
                          </AccordionTrigger>
                          <AccordionContent>
                            <div>
                              <FormField
                                control={form.control}
                                name={`code.steps.${stepIndex}.tool`}
                                render={({ field }) => (
                                  <FormItem className="bg-white">
                                    <FormControl>
                                      <Input
                                        {...field}
                                        className="input-text !px-0 !text-xs"
                                        placeholder="MCP tool name If it needs to be called"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`code.steps.${stepIndex}.outputSchema`}
                                render={({ field }) => (
                                  <FormItem className="bg-white">
                                    <FormControl>
                                      <Textarea
                                        {...field}
                                        className="input-text !px-0 !text-xs h-20"
                                        placeholder="Schema"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => codeSteps.remove(stepIndex)}
                      >
                        <XIcon className="size-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </form>
      </Form>
    </div>
  );
}
