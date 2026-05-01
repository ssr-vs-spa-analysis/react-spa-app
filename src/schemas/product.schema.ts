import { z } from "zod";

const apiProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.union([z.number(), z.string()]),
  quantity: z.number(),
  category: z.string(),
  brand: z.string(),
  rating: z.number(),
  images: z.array(z.string()),
  attributes: z.record(z.string(), z.unknown()),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const paginatedProductsSchema = z.object({
  items: z.array(apiProductSchema),
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative()
});

const productDetailResponseSchema = z.object({
  product: apiProductSchema,
  similarProducts: z.array(apiProductSchema)
});

export const productDetailPayloadSchema = z.union([
  productDetailResponseSchema,
  apiProductSchema
]);
