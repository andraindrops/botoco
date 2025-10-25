import { auth } from "@clerk/nextjs/server";

export async function getTeamId() {
  const { userId, orgId: teamId } = await auth();

  if (userId == null || teamId == null) {
    throw new Error("Unauthorized");
  }

  return teamId;
}
