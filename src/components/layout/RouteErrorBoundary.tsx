import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { SeoMetadata } from "@/components/seo/SeoMetadata";
import { SEO_METADATA } from "@/config/seo-metadata";

export const RouteErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
        <SeoMetadata {...SEO_METADATA.missingProduct} />
        Traženi sadržaj nije pronađen.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <SeoMetadata {...SEO_METADATA.routeError} />
      Došlo je do greške pri učitavanju stranice.
    </div>
  );
};
