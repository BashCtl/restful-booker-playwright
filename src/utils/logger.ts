type LogEntry = { type: "Request Details" | "Response Details"; data: unknown };

export class APILogger {
  private recentLogs: LogEntry[] = [];

  logRequest(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: unknown,
  ): void {
    this.recentLogs.push({
      type: "Request Details",
      data: { method, url, headers: redact(headers), body },
    });
  }

  logResponse(statusCode: number, body?: unknown): void {
    this.recentLogs.push({
      type: "Response Details",
      data: { statusCode, body },
    });
  }
  
  getRecentLogs(): string {
    return this.recentLogs
      .map((log) => `===${log.type}===\n${JSON.stringify(log.data, null, 2)}`)
      .join("\n\n");
  }
}

// Hide token from logs
function redact(headers: Record<string, string>): Record<string, string> {
  const copy = { ...headers };
  if (copy.Cookie) copy.Cookie = "token=***";
  return copy;
}
