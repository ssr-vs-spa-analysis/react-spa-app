import {
  buildBrandQueryValue,
  buildCategoryQueryValue,
  parseSearchParams,
  SEARCH_PAGE_LIMIT
} from "@/features/search/query/search-query-params";
import { productService } from "@/services/product.service";

export const searchLoader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const filters = parseSearchParams(url.search);
  const offset = (filters.page - 1) * SEARCH_PAGE_LIMIT;

  const result = await productService.searchProducts({
    q: filters.searchQuery,
    category: buildCategoryQueryValue(filters.selectedCategories),
    brand: buildBrandQueryValue(filters.selectedBrands),
    priceMin: filters.priceRange[0] ?? undefined,
    priceMax: filters.priceRange[1] ?? undefined,
    limit: SEARCH_PAGE_LIMIT,
    offset
  });

  return {
    filters,
    result
  };
};

export type SearchLoaderData = Awaited<ReturnType<typeof searchLoader>>;
