import { useLoaderData, useNavigation } from "react-router-dom";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import type { ProductDetailLoaderData } from "@/features/product-detail/loader";

export const ProductDetailPage = () => {
  const navigation = useNavigation();
  const { product, similarProducts } = useLoaderData<ProductDetailLoaderData>();
  const isLoadingProductRoute =
    navigation.state === "loading" &&
    navigation.location.pathname.startsWith("/product/");

  if (isLoadingProductRoute) return <ProductDetailSkeleton />;

  return (
    <div className="space-y-8">
      <ProductDetailView product={product} />
      {similarProducts.length > 0 ? (
        <section className="space-y-3" aria-label="Slični proizvodi">
          <h2 className="text-xl font-semibold text-slate-900">
            Slični proizvodi
          </h2>
          <div className="-mx-1 overflow-x-auto pb-4">
            <div className="flex min-w-max gap-4 px-1">
              {similarProducts.map((product) => (
                <div key={product.id} className="w-[240px] shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};
