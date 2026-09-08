import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { StableImage } from "@/components/ui/StableImage";
import { formatRsdPrice } from "@/services/price.formatter";
import type { ProductSummary } from "@/types/product.types";

type Props = { product: ProductSummary; priority?: boolean };

export const ProductCard = ({ product, priority = false }: Props) => (
  <Link
    to={`/product/${product.id}`}
    className="block overflow-hidden rounded-lg border border-slate-200 bg-white p-3 hover:shadow-sm"
  >
    {product.thumbnailUrl ? (
      <StableImage
        src={product.thumbnailUrl}
        alt={product.title}
        width={320}
        height={180}
        priority={priority}
        className="h-[180px] w-full rounded-md object-cover"
      />
    ) : (
      <div
        className="flex h-[180px] w-full items-center justify-center rounded-md bg-slate-100 text-sm text-slate-500"
        role="img"
        aria-label={`${product.title}: nema slike`}
      >
        Nema slike
      </div>
    )}
    <h3 className="mt-3 text-sm font-semibold text-slate-900">
      {product.title}
    </h3>
    <div className="mt-2 flex items-center justify-between">
      <Badge>{product.category}</Badge>
      <span className="text-sm font-medium text-slate-800">
        {formatRsdPrice(product.price)}
      </span>
    </div>
  </Link>
);
