export * as EventSchema from "@/_schemas/external/microsoft/graph/event";
export * as MailSchema from "@/_schemas/external/microsoft/graph/mail";
export * as UserSchema from "@/_schemas/external/microsoft/graph/user";

export type ItemsResponse<T> = {
  value: T[];
  "@odata.nextLink"?: string;
};
