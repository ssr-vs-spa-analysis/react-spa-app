import { apiService } from "@/services/api.service";
import {
  paginatedProductsSchema,
  productDetailPayloadSchema
} from "@/schemas/product.schema";
import { mapApiToDetail, mapApiToSummary } from "@/services/product.mapper";
import type { ProductDetail, ProductSummary } from "@/types/product.types";

export const productService = {
  async listFeatured(
    limit = 12,
    signal?: AbortSignal
  ): Promise<ProductSummary[]> {
    const data = await apiService.get(
      "/api/products",
      paginatedProductsSchema,
      { limit, offset: 0 },
      signal
    );
    return data.items.map(mapApiToSummary);
  },

  async searchProducts(
    params: {
      q?: string;
      category?: string;
      brand?: string;
      priceMin?: number;
      priceMax?: number;
      limit?: number;
      offset?: number;
    },
    signal?: AbortSignal
  ): Promise<{
    items: ProductSummary[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const data = await apiService.get(
      "/api/products/search",
      paginatedProductsSchema,
      {
        q: params.q,
        category: params.category,
        brand: params.brand,
        price_min: params.priceMin,
        price_max: params.priceMax,
        limit: params.limit,
        offset: params.offset
      },
      signal
    );
    return { ...data, items: data.items.map(mapApiToSummary) };
  },

  async getProductDetail(
    id: string,
    signal?: AbortSignal
  ): Promise<{ product: ProductDetail; similarProducts: ProductSummary[] }> {
    const data = await apiService.get(
      `/api/products/${id}`,
      productDetailPayloadSchema,
      undefined,
      signal
    );

    if ("product" in data) {
      return {
        product: mapApiToDetail(data.product),
        similarProducts: data.similarProducts.map(mapApiToSummary)
      };
    }

    return {
      product: mapApiToDetail(data),
      similarProducts: []
    };
  }
};
