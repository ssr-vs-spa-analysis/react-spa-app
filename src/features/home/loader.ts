import { productService } from "@/services/product.service";

export const homeLoader = async () => {
  const featuredProducts = await productService.listFeatured(12);
  return { featuredProducts };
};

export type HomeLoaderData = Awaited<ReturnType<typeof homeLoader>>;
