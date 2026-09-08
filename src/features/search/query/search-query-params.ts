import { z } from "zod";
import {
  SEARCH_BRAND_OPTIONS,
  SEARCH_CATEGORY_OPTIONS
} from "@/constants/search-filters";

export type SearchParamsState = {
  searchQuery: string;
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number | null, number | null];
  page: number;
};

const DEFAULT_MIN_PRICE = null;
const DEFAULT_MAX_PRICE = null;
export const SEARCH_PAGE_LIMIT = 24;

export const DEFAULT_SEARCH_PRICE_RANGE: [number | null, number | null] = [
  DEFAULT_MIN_PRICE,
  DEFAULT_MAX_PRICE
];

const searchParamsSchema = z.object({
  q: z.string().trim().catch(""),
  categories: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).catch(1)
});

const splitCommaList = (raw: string) =>
  raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

const matchCategoryToken = (token: string): string | null => {
  const found = SEARCH_CATEGORY_OPTIONS.find(
    (item) => item.toLowerCase() === token.toLowerCase()
  );
  return found ?? null;
};

const matchBrandToken = (token: string): string | null => {
  const found = SEARCH_BRAND_OPTIONS.find(
    (item) => item.toLowerCase() === token.toLowerCase()
  );
  return found ?? null;
};

export const buildCategoryQueryValue = (categories: string[]) =>
  categories.length > 0
    ? [...new Set(categories)]
        .sort((a, b) => a.localeCompare(b))
        .map((value) => value.toLowerCase())
        .join(",")
    : undefined;

export const buildBrandQueryValue = (brands: string[]) =>
  brands.length > 0
    ? [...new Set(brands)]
        .sort((a, b) => a.localeCompare(b))
        .map((value) => value.toLowerCase())
        .join(",")
    : undefined;

const normalizeMinPrice = (value: string | null): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, Math.floor(parsed));
};

const normalizeMaxPrice = (value: string | null): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.floor(parsed);
};

export const parseSearchParams = (search: string): SearchParamsState => {
  const urlParams = new URLSearchParams(search);
  const params = searchParamsSchema.parse({
    q: urlParams.get("q") ?? "",
    categories: urlParams.get("categories") ?? undefined,
    brand: urlParams.get("brand") ?? undefined,
    page: urlParams.get("page") ?? undefined
  });

  const parsedMin = normalizeMinPrice(urlParams.get("price_min"));
  const parsedMax = normalizeMaxPrice(urlParams.get("price_max"));
  const normalizedRange: [number | null, number | null] =
    parsedMin !== null && parsedMax !== null && parsedMin > parsedMax
      ? [parsedMax, parsedMin]
      : [parsedMin, parsedMax];

  const selectedCategories = params.categories
    ? splitCommaList(params.categories)
        .map(matchCategoryToken)
        .filter((value): value is string => value !== null)
    : [];

  const selectedBrands = params.brand
    ? splitCommaList(params.brand)
        .map(matchBrandToken)
        .filter((value): value is string => value !== null)
    : [];

  return {
    searchQuery: params.q,
    selectedCategories,
    selectedBrands,
    priceRange: normalizedRange,
    page: params.page
  };
};

export const toSearchParams = (state: SearchParamsState): string => {
  const params = new URLSearchParams();
  const normalizedQuery = state.searchQuery.trim();
  const categoriesValue = buildCategoryQueryValue(state.selectedCategories);
  const brandValue = buildBrandQueryValue(state.selectedBrands);
  const minPrice =
    state.priceRange[0] === null
      ? null
      : Math.max(0, Math.floor(state.priceRange[0]));
  const maxPrice =
    state.priceRange[1] === null || state.priceRange[1] <= 0
      ? null
      : Math.floor(state.priceRange[1]);
  const normalizedRange: [number | null, number | null] =
    minPrice !== null && maxPrice !== null && minPrice > maxPrice
      ? [maxPrice, minPrice]
      : [minPrice, maxPrice];

  if (normalizedQuery) params.set("q", normalizedQuery);
  if (categoriesValue) params.set("categories", categoriesValue);
  if (brandValue) params.set("brand", brandValue);
  if (normalizedRange[0] !== null)
    params.set("price_min", String(normalizedRange[0]));
  if (normalizedRange[1] !== null)
    params.set("price_max", String(normalizedRange[1]));
  params.set("page", String(Math.max(1, state.page)));

  return params.toString();
};
