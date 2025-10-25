import { ComposioToolSet, VercelAIToolSet } from "composio-core";

export async function init({
  teamId,
  appName,
  redirectUri,
}: {
  teamId: string;
  appName: string;
  redirectUri: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (baseUrl == null) {
    throw new Error("Not found NEXT_PUBLIC_BASE_URL");
  }

  const apiKey = process.env.COMPOSIO_API_KEY;

  if (apiKey == null) {
    throw new Error("Not found COMPOSIO_API_KEY");
  }

  const toolset = new ComposioToolSet({ apiKey });

  const entity = toolset.client.getEntity(teamId);

  const connection = await entity.initiateConnection({
    appName,
    redirectUri,
  });

  return connection;
}

export async function getTools({ teamId }: { teamId: string }) {
  const apiKey = process.env.COMPOSIO_API_KEY;

  if (apiKey == null) {
    throw new Error("Not found COMPOSIO_API_KEY");
  }

  const toolset = new VercelAIToolSet({ apiKey, entityId: teamId });

  const tools = await toolset.getTools({
    apps: [
      // "gmail",
      // "googlecalendar",
      // "googledrive",
      // "googlesheets",
      // "googledocs",
      // "github",
      // "slack",
    ],
    actions: [
      "GMAIL_SEND_EMAIL",
      "GOOGLECALENDAR_FIND_EVENT",
      "GOOGLESHEETS_BATCH_UPDATE",
      "GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN",
      "GITHUB_CREATE_AN_ISSUE",
      "SLACK_SENDS_A_MESSAGE_TO_A_SLACK_CHANNEL",
    ],
  });

  return tools;
}

export async function getConnectedAccount({
  connectedAccountId,
}: {
  connectedAccountId: string;
}) {
  const apiKey = process.env.COMPOSIO_API_KEY;

  if (apiKey == null) {
    throw new Error("Not found COMPOSIO_API_KEY");
  }

  const toolset = new ComposioToolSet({ apiKey });

  const connectedAccount = await toolset.client.connectedAccounts.get({
    connectedAccountId,
  });

  return connectedAccount;
}
