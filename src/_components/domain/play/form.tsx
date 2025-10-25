"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { cn } from "@/_lib/utils";

import * as playSchema from "@/_schemas/domain/play";

import * as playAction from "@/_actions/domain/play";

import { Button } from "@/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { Switch } from "@/_components/ui/switch";
import { Textarea } from "@/_components/ui/textarea";

import { PlayIcon } from "lucide-react";

export default function Component({
  noteId,
  play,
  className,
  ...props
}: {
  noteId: string;
  play: playSchema.entitySchema;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const handleSubmit = async ({ data }: { data: playSchema.updateSchema }) => {
    await playAction.update({
      noteId,
      id: play.id,
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
              outputRecord: step.outputRecord,
              actionStatus: step.actionStatus,
              reviewStatus: step.reviewStatus,
            };
          }),
        },
      },
    });
  };

  const form = useForm<playSchema.updateSchema>({
    resolver: zodResolver(playSchema.updateZodSchema),
    defaultValues: {
      name: play.name,
      code: {
        steps: play.code.steps.map((step) => {
          return {
            name: step.name,
            text: step.text,
            tool: step.tool,
            outputSchema: step.outputSchema,
            approvalRequired: step.approvalRequired,
            outputRecord: step.outputRecord,
            actionStatus: step.actionStatus,
            reviewStatus: step.reviewStatus,
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
            <Button
              type="button"
              onClick={() => playAction.runStepMany({ noteId, id: play.id })}
            >
              <PlayIcon />
              <div>Play</div>
            </Button>
          </div>
          <div className="max-w-xs">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <section>
            <div className="space-y-2">
              {codeSteps.fields.map((step, stepIndex) => (
                <div key={step.id} className="px-4">
                  <div className="grid grid-flow-col grid-cols-12 gap-4">
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`code.steps.${stepIndex}.name`}
                        render={({ field }) => (
                          <FormItem className="bg-white">
                            <FormControl>
                              <Input
                                {...field}
                                className="input-text !px-0 !text-xs"
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name={`code.steps.${stepIndex}.text`}
                        render={({ field }) => (
                          <FormItem className="bg-white">
                            <FormControl>
                              <Textarea {...field} hidden />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`code.steps.${stepIndex}.tool`}
                        render={({ field }) => (
                          <FormItem className="bg-white">
                            <FormControl>
                              <Input {...field} hidden />
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
                              <Input {...field} hidden />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`code.steps.${stepIndex}.outputRecord`}
                        render={({ field }) => (
                          <FormItem className="bg-white">
                            <FormControl>
                              <Input
                                {...field}
                                className="input-text !px-0 !text-xs"
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`code.steps.${stepIndex}.actionStatus`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={true}
                              >
                                <SelectTrigger className="w-[80px] bg-white font-mono text-xs">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent
                                  position="item-aligned"
                                  className="bg-white font-mono text-xs"
                                >
                                  <SelectItem value="wait">wait</SelectItem>
                                  <SelectItem value="done">done</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`code.steps.${stepIndex}.approvalRequired`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                hidden
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`code.steps.${stepIndex}.reviewStatus`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                name={field.name}
                                value={field.value}
                                onValueChange={(v) => {
                                  field.onChange(v);
                                  form.handleSubmit(async (data) => {
                                    await handleSubmit({ data });
                                  })();
                                }}
                                disabled={
                                  !(
                                    step.actionStatus === "done" &&
                                    step.reviewStatus === "wait"
                                  )
                                }
                              >
                                <SelectTrigger className="w-[80px] bg-white font-mono text-xs">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent
                                  position="item-aligned"
                                  className="bg-white font-mono"
                                >
                                  <SelectItem value="wait">wait</SelectItem>
                                  <SelectItem value="accept">accept</SelectItem>
                                  <SelectItem value="reject">reject</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        playAction.runStepById({
                          noteId,
                          id: play.id,
                          stepId: step.name,
                        })
                      }
                      disabled={step.actionStatus !== "wait"}
                    >
                      <PlayIcon />
                    </Button> */}
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
