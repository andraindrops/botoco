import type * as microsoftGraphSchema from "@/_schemas/external/microsoft/graph";

import { BASE_URL } from "@/_services/external/microsoft/graph";

export async function findByMe({ accessToken }: { accessToken: string }) {
  const apiPath = "/me";

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

  const data: microsoftGraphSchema.UserSchema.entitySchema = await res.json();

  return {
    data: data,
  };
}
