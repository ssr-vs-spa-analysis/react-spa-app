import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation
} from "react-router-dom";
import { ProductSearchInput } from "@/components/product/ProductSearchInput";
import { SearchFiltersPanel } from "@/components/product/SearchFiltersPanel";
import { SearchResultsGrid } from "@/components/product/SearchResultsGrid";
import { Button } from "@/components/ui/button";
import type { SearchLoaderData } from "@/features/search/loader";
import {
  SEARCH_PAGE_LIMIT,
  type SearchParamsState,
  toSearchParams
} from "@/features/search/query/search-query-params";

const SEARCH_DEBOUNCE_MS = 300;

type PaginationItem = number | "ellipsis";

export const SearchPage = () => {
  const loaderData = useLoaderData<SearchLoaderData>();
  const navigation = useNavigation();
  const location = useLocation();
  const navigate = useNavigate();

  const urlState = useMemo(() => loaderData.filters, [loaderData.filters]);
  const [searchInput, setSearchInput] = useState(urlState.searchQuery);

  useEffect(() => {
    setSearchInput(urlState.searchQuery);
  }, [urlState.searchQuery]);

  const updateSearch = useCallback(
    (nextState: Partial<SearchParamsState>, nextPage = 1) => {
      const targetState: SearchParamsState = {
        ...urlState,
        ...nextState,
        page: nextPage
      };
      void navigate({
        search: toSearchParams(targetState)
      });
    },
    [navigate, urlState]
  );

  useEffect(() => {
    const trimmedSearchInput = searchInput.trim();
    if (trimmedSearchInput === urlState.searchQuery) return;

    const timeoutId = window.setTimeout(() => {
      updateSearch({ searchQuery: trimmedSearchInput });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput, updateSearch, urlState.searchQuery]);

  const handleCategoryToggle = (value: string, checked: boolean) => {
    const nextCategories = checked
      ? [...urlState.selectedCategories, value]
      : urlState.selectedCategories.filter((c) => c !== value);
    const deduped = [...new Set(nextCategories)];
    updateSearch(
      {
        searchQuery: searchInput,
        selectedCategories: deduped
      },
      1
    );
  };

  const handlePriceChange = (value: [number | null, number | null]) => {
    updateSearch(
      {
        searchQuery: searchInput,
        priceRange: value
      },
      1
    );
  };

  const handleBrandToggle = (brand: string) => {
    const has = urlState.selectedBrands.includes(brand);
    const nextBrands = has
      ? urlState.selectedBrands.filter((b) => b !== brand)
      : [...urlState.selectedBrands, brand];
    updateSearch(
      {
        searchQuery: searchInput,
        selectedBrands: [...new Set(nextBrands)]
      },
      1
    );
  };

  const totalPages = Math.max(
    1,
    Math.ceil(loaderData.result.total / SEARCH_PAGE_LIMIT)
  );
  const currentPage = urlState.page;
  const isLoadingResults =
    navigation.state === "loading" &&
    navigation.location.pathname === location.pathname;

  const goToPage = (page: number) => {
    updateSearch({}, page);
  };

  const paginationItems = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    if (currentPage <= 3)
      return [1, 2, 3, "ellipsis", totalPages] as PaginationItem[];

    if (currentPage >= totalPages - 2)
      return [
        1,
        "ellipsis",
        totalPages - 2,
        totalPages - 1,
        totalPages
      ] as PaginationItem[];

    return [
      1,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages
    ] as PaginationItem[];
  }, [currentPage, totalPages]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[20%_80%]">
      <ProductSearchInput
        value={searchInput}
        onChange={setSearchInput}
        cardClassName="lg:col-span-2"
        id="search-page-product-search"
      />

      <SearchFiltersPanel
        selectedCategories={urlState.selectedCategories}
        selectedBrands={urlState.selectedBrands}
        priceRange={urlState.priceRange}
        onCategoryToggle={handleCategoryToggle}
        onBrandToggle={handleBrandToggle}
        onPriceRangeChange={handlePriceChange}
      />

      <div className="space-y-4 lg:min-h-0">
        <div
          className="hide-scrollbar lg:max-h-[calc(100vh+40px)] lg:min-h-[calc(100vh+40px)] lg:overflow-y-auto lg:pr-2"
          aria-busy={isLoadingResults}
          aria-live="polite"
        >
          <SearchResultsGrid
            items={loaderData.result.items}
            loading={isLoadingResults}
            error={null}
          />
        </div>
      </div>

      <div className="w-full lg:col-span-2">
        <nav
          className="flex w-full flex-wrap items-center justify-center gap-2"
          aria-label="Paginacija rezultata"
        >
          <Button
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Prethodna strana
          </Button>

          {paginationItems.map((item, index) => {
            if (item === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-sm text-slate-500"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            const isActive = item === currentPage;
            return (
              <Button
                key={item}
                type="button"
                onClick={() => goToPage(item)}
                className={
                  isActive
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }
                aria-current={isActive ? "page" : undefined}
              >
                {item}
              </Button>
            );
          })}

          <Button
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Sledeća strana
          </Button>
        </nav>
      </div>
    </div>
  );
};
