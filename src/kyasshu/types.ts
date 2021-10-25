export interface RequestArgs {
  readonly method: string;
  readonly params?: readonly unknown[];
}

export interface KyaApi {
  url: string;
  disconnect(): Promise<any>;
  connect(): Promise<any>;
  request(req: RequestArgs): Promise<unknown>;
  on(
    event: "connected" | "disconnected",
    listener: (...args: any[]) => void
  ): this;
}
