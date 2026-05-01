import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import type { ProductSummary } from "@/types/product.types";

type Props = {
  items: ProductSummary[];
  loading: boolean;
  error: string | null;
};

export const SearchResultsGrid = ({ items, loading, error }: Props) => {
  if (loading)
    return (
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </section>
    );
  if (error)
    return (
      <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
    );
  if (!items.length)
    return (
      <p className="text-sm text-slate-600">
        Nema proizvoda koji odgovaraju trenutnim filterima.
      </p>
    );
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <ProductCard key={item.id} product={item} />
      ))}
    </section>
  );
};
