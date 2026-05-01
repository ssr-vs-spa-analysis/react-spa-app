import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { StableImage } from "@/components/ui/StableImage";
import { formatRsdPrice } from "@/services/price.formatter";
import type { ProductSummary } from "@/types/product.types";

type Props = { product: ProductSummary };

export const ProductCard = ({ product }: Props) => (
  <Link
    to={`/product/${product.id}`}
    className="block overflow-hidden rounded-lg border border-slate-200 bg-white p-3 hover:shadow-sm"
  >
    <StableImage
      src={product.thumbnailUrl}
      alt={product.title}
      className="h-[180px] w-full rounded-md object-cover"
    />
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
