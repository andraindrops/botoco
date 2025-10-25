import type * as microsoftGraphSchema from "@/_schemas/external/microsoft/graph";

import { BASE_URL } from "@/_services/external/microsoft/graph";

export async function findMany({ accessToken }: { accessToken: string }) {
  const apiPath = "/me/mailFolders/Inbox/messages";

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

  const data: microsoftGraphSchema.ItemsResponse<microsoftGraphSchema.MailSchema.entitySchema> =
    await res.json();

  // biome-ignore format: <explanation>
  const items = data.value.map((m) => ({
    id:               m.id,
    from:             m.from?.emailAddress?.address,
    subject:          m.subject,
    bodyPreview:      m.bodyPreview,
    webLink:          m.webLink,
    receivedDateTime: m.receivedDateTime,
  }));

  return {
    data: items,
  };
}
