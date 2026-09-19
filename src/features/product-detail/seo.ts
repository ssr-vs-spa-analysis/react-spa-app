import { truncateSeoText } from "@/services/seo-description";
import type { SeoMetadataValues } from "@/config/seo-metadata";
import type { ProductDetail } from "@/types/product.types";

export const getProductSeoMetadata = (
  product: ProductDetail
): SeoMetadataValues => ({
  title: `${product.title} | eProdavnica`,
  description: truncateSeoText(product.description, 160),
  openGraphTitle: product.title,
  openGraphDescription: truncateSeoText(product.description, 200),
  openGraphImage: product.imageUrl === "" ? undefined : product.imageUrl
});
