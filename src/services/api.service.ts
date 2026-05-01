import { env } from "@/config/env";
import { z } from "zod";

const BASE_URL = env.VITE_API_URL;

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class ApiResponseParseError extends Error {
  readonly endpoint: string;
  readonly issues: z.ZodIssue[];

  constructor(endpoint: string, error: z.ZodError) {
    super(`Invalid API response for endpoint "${endpoint}".`);
    this.name = "ApiResponseParseError";
    this.endpoint = endpoint;
    this.issues = error.issues;
  }
}

type QueryValue = string | number | undefined;

const withQuery = (endpoint: string, query?: Record<string, QueryValue>) => {
  if (!query) return `${BASE_URL}${endpoint}`;

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });

  const suffix = params.toString();
  return suffix ? `${BASE_URL}${endpoint}?${suffix}` : `${BASE_URL}${endpoint}`;
};

export const apiService = {
  async get<TSchema extends z.ZodTypeAny>(
    endpoint: string,
    schema: TSchema,
    query?: Record<string, QueryValue>,
    signal?: AbortSignal
  ): Promise<z.infer<TSchema>> {
    const response = await fetch(withQuery(endpoint, query), {
      signal,
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) {
      throw new ApiError(
        `API Error: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const json: unknown = await response.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      throw new ApiResponseParseError(endpoint, parsed.error);
    }

    return parsed.data;
  }
};
