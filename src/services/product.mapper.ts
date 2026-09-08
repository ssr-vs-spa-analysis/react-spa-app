import type {
  ApiProduct,
  ProductDetail,
  ProductSummary
} from "@/types/product.types";

const toPrice = (price: ApiProduct["price"]): number => {
  if (typeof price === "number") return price;

  const parsedPrice = Number.parseFloat(price);
  return Number.isFinite(parsedPrice) ? parsedPrice : 0;
};

const toStock = (quantity: number): ProductDetail["stockStatus"] => {
  if (quantity <= 0) return "nema_na_stanju";
  if (quantity <= 5) return "niske_zalihe";
  return "na_stanju";
};

export const mapApiToSummary = (product: ApiProduct): ProductSummary => ({
  id: product.id,
  title: product.name,
  category: product.category,
  thumbnailUrl: product.images[0] ?? "",
  price: toPrice(product.price),
  rating: product.rating
});

export const mapApiToDetail = (product: ApiProduct): ProductDetail => ({
  id: product.id,
  title: product.name,
  description: product.description,
  category: product.category,
  imageUrl: product.images[0] ?? "",
  price: toPrice(product.price),
  brand: product.brand,
  stockStatus: toStock(product.quantity)
});
