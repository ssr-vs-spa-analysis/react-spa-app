import {
  Navigate,
  RouterProvider,
  createBrowserRouter
} from "react-router-dom";
import { MainLayout } from "@/app/layouts/MainLayout";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";
import { RouteErrorBoundary } from "@/components/layout/RouteErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { homeLoader } from "@/features/home/loader";
import { productDetailLoader } from "@/features/product-detail/loader";
import { searchLoader } from "@/features/search/loader";
import { HomePage } from "@/pages/home/HomePage";
import { ProductDetailPage } from "@/pages/product-detail/ProductDetailPage";
import { ProductDetailRouteError } from "@/pages/product-detail/ProductDetailRouteError";
import { SearchPage } from "@/pages/search/SearchPage";

const ResultsGridHydrateFallback = () => (
  <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {Array.from({ length: 9 }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </section>
);

const HomeHydrateFallback = () => (
  <div className="space-y-6">
    <Skeleton className="h-40 w-full rounded-xl" />
    <Skeleton className="h-11 w-full" />
    <section>
      <Skeleton className="mb-4 h-7 w-64" />
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </section>
    </section>
  </div>
);

const SearchHydrateFallback = () => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-[20%_80%]">
    <Skeleton className="h-11 w-full lg:col-span-2" />
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <Skeleton className="mb-3 h-6 w-32" />
      <Skeleton className="h-56 w-full" />
    </div>
    <ResultsGridHydrateFallback />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        loader: homeLoader,
        hydrateFallbackElement: <HomeHydrateFallback />,
        element: <HomePage />
      },
      {
        path: "search",
        loader: searchLoader,
        hydrateFallbackElement: <SearchHydrateFallback />,
        element: <SearchPage />
      },
      {
        path: "product/:id",
        loader: productDetailLoader,
        hydrateFallbackElement: <ProductDetailSkeleton />,
        errorElement: <ProductDetailRouteError />,
        element: <ProductDetailPage />
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
]);

export const AppRouter = () => <RouterProvider router={router} />;
