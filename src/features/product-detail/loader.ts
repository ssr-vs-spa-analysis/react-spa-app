import { ApiError } from "@/services/api.service";
import { productService } from "@/services/product.service";

type ProductDetailLoaderArgs = {
  params: { id?: string };
  request: Request;
};

export const productDetailLoader = async ({
  params,
  request
}: ProductDetailLoaderArgs) => {
  const productId = params.id?.trim();
  if (!productId) {
    throw new Response("Product id is required.", { status: 404 });
  }

  try {
    const payload = await productService.getProductDetail(
      productId,
      request.signal
    );

    return {
      productId,
      ...payload
    };
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Response("Product not found.", { status: 404 });
    }

    throw error;
  }
};

export type ProductDetailLoaderData = Awaited<
  ReturnType<typeof productDetailLoader>
>;
