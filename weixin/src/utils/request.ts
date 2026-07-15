import Taro from "@tarojs/taro";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: Record<string, unknown>;
  header?: Record<string, string>;
}

export class HttpError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message ?? `Request failed: ${status}`);
    this.status = status;
  }
}

export async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const res = await Taro.request({
    url,
    method: options.method ?? "GET",
    data: options.data,
    header: {
      "Content-Type": "application/json",
      ...options.header,
    },
  });
  if (res.statusCode < 200 || res.statusCode >= 300) {
    throw new HttpError(res.statusCode);
  }
  return res.data as T;
}
