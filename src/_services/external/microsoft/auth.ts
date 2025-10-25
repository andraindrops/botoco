import { clerkClient } from "@clerk/nextjs/server";

export async function getAccessToken({ userId }: { userId: string }) {
  const client = await clerkClient();

  const res = await client.users.getUserOauthAccessToken(userId, "microsoft");

  const token: string | undefined = res?.data?.[0]?.token;

  return token ?? null;
}
