import type * as microsoftGraphSchemas from "@/_schemas/external/microsoft/graph";

import { BASE_URL } from "@/_services/external/microsoft/graph";

export async function findByMe({ accessToken }: { accessToken: string }) {
  const apiPath = "/me/calendar/events";

  const url = `${BASE_URL}${apiPath}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.ok !== true) {
    throw new Error("Failed to fetch");
  }

  const data: microsoftGraphSchemas.ItemsResponse<microsoftGraphSchemas.EventSchema.entitySchema> =
    await res.json();

  // biome-ignore format: <explanation>
  const items = data.value.map((m) => ({
      id:      m.id,
      subject: m.subject,
      webLink: m.webLink,
      start:   m.start,
      end:     m.end,
    }));

  return {
    data: items,
  };
}

export async function create({
  accessToken,
  event,
}: {
  accessToken: string;
  event: microsoftGraphSchemas.EventSchema.createSchema;
}) {
  const apiPath = "/me/calendar/events";

  const url = `${BASE_URL}${apiPath}`;

  let res: Response | null = null;

  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...event,
        body: {
          contentType: "text",
          content: "",
        },
      }),
    });
  } catch (error) {
    console.error(error);
  }

  if (res?.ok !== true) {
    throw new Error("Failed to fetch");
  }

  const data: microsoftGraphSchemas.EventSchema.entitySchema = await res.json();

  return {
    data: data,
  };
}
