import { Outlet, useLocation, useNavigation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const HomeRouteSkeleton = () => (
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

export const MainLayout = () => {
  const navigation = useNavigation();
  const location = useLocation();
  const isLoadingHomeRoute =
    navigation.state === "loading" &&
    navigation.location.pathname === "/" &&
    location.pathname !== "/";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        {isLoadingHomeRoute ? <HomeRouteSkeleton /> : <Outlet />}
      </main>
    </div>
  );
};
