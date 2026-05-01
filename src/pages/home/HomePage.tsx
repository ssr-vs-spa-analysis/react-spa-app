import { useState } from "react";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { HeroSection } from "@/components/layout/HeroSection";
import { FeaturedProductsGrid } from "@/components/product/FeaturedProductsGrid";
import { ProductSearchInput } from "@/components/product/ProductSearchInput";
import type { HomeLoaderData } from "@/features/home/loader";
import {
  DEFAULT_SEARCH_PRICE_RANGE,
  toSearchParams
} from "@/features/search/query/search-query-params";

export const HomePage = () => {
  const { featuredProducts } = useLoaderData<HomeLoaderData>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const isLoadingHome =
    navigation.state === "loading" && navigation.location.pathname === "/";

  const handleHomeSearchSubmit = () => {
    void navigate({
      pathname: "/search",
      search: toSearchParams({
        searchQuery: searchQuery.trim(),
        selectedCategories: [],
        selectedBrands: [],
        priceRange: DEFAULT_SEARCH_PRICE_RANGE,
        page: 1
      })
    });
  };

  return (
    <div className="space-y-6">
      <HeroSection />
      <ProductSearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        onSubmit={handleHomeSearchSubmit}
        id="home-product-search"
      />
      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Preporučeni proizvodi
        </h2>
        <FeaturedProductsGrid
          items={isLoadingHome ? [] : featuredProducts}
          loading={isLoadingHome}
          error={null}
        />
      </section>
    </div>
  );
};
