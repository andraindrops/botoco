export {};

type ToolCall = {
  name: string;
  args: {
    url?: string;
    query?: string;
    value?: string;
  };
};

declare global {
  interface Window {
    electron?: {
      ping: () => void;
      toolCall: (toolCall: ToolCall) => Promise<string>;
    };
  }
}
