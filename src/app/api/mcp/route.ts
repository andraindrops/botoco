import { auth } from "@clerk/nextjs/server";
import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";

import * as microsoftGraphSchema from "@/_schemas/external/microsoft/graph";

import * as microsoftAuthService from "@/_services/external/microsoft/auth";
import * as microsoftGraphCalendarService from "@/_services/external/microsoft/graph/event";
import * as microsoftGraphMailService from "@/_services/external/microsoft/graph/mail";
import * as microsoftGraphUserService from "@/_services/external/microsoft/graph/user";

const handler = createMcpHandler(
  (server) => {
    server.tool("get_current_time", "Get current time", {}, async (_args) => {
      const result = {
        data: {
          currentTime: new Date().toISOString(),
        },
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result.data) }],
      };
    });

    server.tool(
      "microsoft_graph_user_findMe",
      "Microsoft Graph User Find Me",
      {},
      async (_args, extra) => {
        const userId = extra.authInfo?.extra?.userId;

        const accessToken = await microsoftAuthService.getAccessToken({
          userId: userId as string,
        });

        const result = await microsoftGraphUserService.findByMe({
          accessToken,
        });

        return {
          content: [{ type: "text", text: JSON.stringify(result.data) }],
        };
      },
    );

    server.tool(
      "microsoft_graph_mail_findMany",
      "Microsoft Graph Mail Find Many",
      {},
      async (_args, extra) => {
        const userId = extra.authInfo?.extra?.userId;

        if (userId == null) {
          throw new Error("Unauthorized");
        }

        const accessToken = await microsoftAuthService.getAccessToken({
          userId: userId as string,
        });

        const result = await microsoftGraphMailService.findMany({
          accessToken,
        });

        return {
          content: [{ type: "text", text: JSON.stringify(result.data) }],
        };
      },
    );

    server.tool(
      "microsoft_graph_event_findMany",
      "Microsoft Graph Event Find Many",
      {},
      async (_args, extra) => {
        const userId = extra.authInfo?.extra?.userId;

        if (userId == null) {
          throw new Error("Unauthorized");
        }

        const accessToken = await microsoftAuthService.getAccessToken({
          userId: userId as string,
        });

        const result = await microsoftGraphCalendarService.findByMe({
          accessToken,
        });

        return {
          content: [{ type: "text", text: JSON.stringify(result.data) }],
        };
      },
    );

    server.tool(
      "microsoft_graph_event_create",
      "Microsoft Graph Event Create",
      microsoftGraphSchema.EventSchema.createZodSchema.shape,
      async (_args, extra) => {
        const userId = extra.authInfo?.extra?.userId;

        if (userId == null) {
          throw new Error("Unauthorized");
        }

        const accessToken = await microsoftAuthService.getAccessToken({
          userId: userId as string,
        });

        const result = await microsoftGraphCalendarService.create({
          accessToken,
          event: {
            subject: _args.subject,
            start: {
              dateTime: _args.start.dateTime,
              timeZone: _args.start.timeZone,
            },
            end: {
              dateTime: _args.end.dateTime,
              timeZone: _args.end.timeZone,
            },
            isOnlineMeeting: _args.isOnlineMeeting,
          },
        });

        return {
          content: [{ type: "text", text: JSON.stringify(result.data) }],
        };
      },
    );
  },
  {
    // Optional server options
  },
  {
    // Optional redis config
    redisUrl: process.env.REDIS_URL,
    basePath: "/api", // this needs to match where the [transport] is located.
    maxDuration: 60,
    verboseLogs: true,
  },
);

const securedHandler = withMcpAuth(
  handler,
  async (_req, bearer) => {
    if (bearer == null) {
      return undefined;
    }

    const { userId } = await auth({ acceptsToken: "session_token" });

    if (userId == null) {
      return undefined;
    }

    return { token: bearer, clientId: userId, scopes: [], extra: { userId } };
  },
  { required: true },
);

export { securedHandler as GET, securedHandler as POST };
