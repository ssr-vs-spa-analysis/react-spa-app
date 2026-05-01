import { z } from "zod";

export const envSchema = z.object({
  VITE_API_URL: z.string().url().default("http://localhost:3000")
});

export type Env = z.infer<typeof envSchema>;
