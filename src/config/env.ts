import { envSchema } from "@/schemas/env.schema";

export const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL as unknown
});
