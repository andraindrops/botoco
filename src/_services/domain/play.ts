// import { createOpenAI } from "@ai-sdk/openai";
// import { generateObject, jsonSchema } from "ai";
import Dedalus from "dedalus-labs";
import outdent from "outdent";

import db from "@/_lib/db";

import type * as playSchema from "@/_schemas/domain/play";

import * as noteService from "@/_services/domain/note";

const client = new Dedalus({
  apiKey: process.env["DEDALUS_API_KEY"],
});

// if (process.env.OPENAI_API_KEY == null) {
//   throw new Error("OPENAI_API_KEY is not set");
// }

// const openai = createOpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const MODEL_NAME = "gpt-5-nano";

// const MODEL = openai(MODEL_NAME);

export async function findMany({
  teamId,
  noteId,
}: {
  teamId: string;
  noteId: string;
}) {
  const plays = await db.play.findMany({
    where: {
      teamId,
      noteId,
    },
    orderBy: { createdAt: "desc" },
  });

  return plays.map((play) => fromDb({ data: play }));
}

export async function findById({
  teamId,
  noteId,
  id,
}: {
  teamId: string;
  noteId: string;
  id: string;
}) {
  const play = await db.play.findUniqueOrThrow({
    where: { teamId, noteId, id },
  });

  return fromDb({ data: play });
}

export async function create({
  teamId,
  noteId,
}: {
  teamId: string;
  noteId: string;
}) {
  const note = await noteService.findById({ teamId, id: noteId });

  const codeSteps: playSchema.entitySchema["code"]["steps"] =
    note.code.steps.map((step) => {
      return {
        name: step.name,
        text: step.text,
        tool: step.tool,
        outputSchema: step.outputSchema,
        approvalRequired: step.approvalRequired,
        outputRecord: "",
        actionStatus: "wait",
        reviewStatus: "wait",
      };
    });

  const play = await db.play.create({
    data: {
      teamId,
      noteId: note.id,
      name: note.name,
      code: JSON.stringify({ steps: codeSteps }),
    },
  });

  return fromDb({ data: play });
}

export async function update({
  teamId,
  noteId,
  id,
  data,
}: {
  teamId: string;
  noteId: string;
  id: string;
  data: playSchema.updateSchema;
}) {
  const play = await db.play.update({
    where: { teamId, noteId, id },
    data: {
      name: data.name,
      // text: data.text,
      code: JSON.stringify(data.code),
    },
  });

  return fromDb({ data: play });
}

export async function remove({
  teamId,
  noteId,
  id,
}: {
  teamId: string;
  noteId: string;
  id: string;
}) {
  const play = await db.play.delete({
    where: { teamId, noteId, id },
  });

  return fromDb({ data: play });
}

export async function runStepMany({
  teamId,
  noteId,
  id,
}: {
  teamId: string;
  noteId: string;
  id: string;
}) {
  const play = await findById({ teamId, noteId, id });

  let prevCodeStep = null;

  for (const codeStep of play.code.steps) {
    if (
      prevCodeStep?.approvalRequired &&
      prevCodeStep?.reviewStatus !== "accept"
    ) {
      break;
    }

    prevCodeStep = codeStep;

    if (codeStep.actionStatus !== "wait") {
      continue;
    }

    await runStep({ teamId, noteId, id, play, step: codeStep });
  }
}

export async function runStepById({
  teamId,
  noteId,
  id,
  stepId,
}: {
  teamId: string;
  noteId: string;
  id: string;
  stepId: string;
}) {
  const play = await findById({ teamId, noteId, id });

  const step = play.code.steps.find((step) => step.name === stepId);

  if (step == null) {
    throw new Error(`Step ${stepId} not found`);
  }

  await runStep({ teamId, noteId, id, play, step });
}

async function runStep({
  teamId,
  noteId,
  id,
  play,
  step,
}: {
  teamId: string;
  noteId: string;
  id: string;
  play: playSchema.entitySchema;
  step: {
    name: string;
    text: string;
    tool: string;
    outputSchema: string;
  };
}) {
  const codeSteps = play.code.steps;

  const prompt = await generatePrompt({ play, stepId: step.name });

  // const schema = jsonSchema(JSON.parse(step.outputSchema));

  // const { object }: { object: { record: any } } = await generateObject({
  //   model: MODEL,
  //   mode: "json",
  //   schema,
  //   prompt,
  // });

  // const record = object.record;

  const completion: { choices: { message: { content: string } }[] } =
    await client.request({
      method: "post",
      path: "/v1/chat/completions",
      body: {
        model: MODEL_NAME,
        messages: [{ role: "user", content: prompt }],
      },
    });

  const record = JSON.parse(completion.choices[0].message.content);

  for (let i = 0; i < codeSteps.length; i++) {
    if (codeSteps[i].name === step.name) {
      codeSteps[i].actionStatus = "done";
      codeSteps[i].outputRecord = JSON.stringify(record);

      if (codeSteps[i].approvalRequired !== true) {
        codeSteps[i].reviewStatus = "accept";
      }
      break;
    }
  }

  await update({
    teamId,
    noteId,
    id,
    data: {
      ...play,
      code: { steps: codeSteps },
    },
  });

  return record;
}

async function generatePrompt({
  play,
  stepId,
}: {
  play: playSchema.entitySchema;
  stepId: string;
}) {
  const step = play.code.steps.find((step) => step.name === stepId);

  if (step == null) {
    throw new Error(`Step ${stepId} not found`);
  }

  const data = play.code.steps.map((step) => {
    return {
      name: step.name,
      outputRecord: step.outputRecord,
    };
  });

  return outdent`
  rules:
    - Output must be strictly following the provided JSON Schema
  prompt:
    ${step.text}
  schema:
    ${step.outputSchema}
  stored data:
    ${JSON.stringify(data)}
  `;
}

export function fromDb({
  data,
}: {
  data: playSchema.entityRawSchema;
}): playSchema.entitySchema {
  const code =
    data.code !== null && data.code !== "" ? JSON.parse(data.code) : [];

  return {
    ...data,
    code,
  };
}
