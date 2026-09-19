import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { SeoMetadata } from "@/components/seo/SeoMetadata";
import { SEO_METADATA } from "@/config/seo-metadata";
import { ProductDetailNotFoundPage } from "@/pages/product-detail/ProductDetailNotFoundPage";

export const ProductDetailRouteError = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <ProductDetailNotFoundPage />;
  }

  return (
    <>
      <SeoMetadata {...SEO_METADATA.routeError} />
      <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
        Neuspešno učitavanje detalja proizvoda.
      </p>
    </>
  );
};
