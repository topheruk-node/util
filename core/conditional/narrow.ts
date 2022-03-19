export const isNumber = (a: any): a is number => typeof a === "number";

export const isString = (a: any): a is string => typeof a === "string";

export const isError = (x: any): x is Error => x instanceof Error;

// export const isWebSocket = <T extends WebSocket>(obj: any): obj is T => "socket" in obj;

// export const isMethod = (method: string): method is "GET" | "POST" | "PUT" | "DELETE" => ["GET", "POST", "PUT", "DELETE"].some(isEqual(method.toUpperCase()));