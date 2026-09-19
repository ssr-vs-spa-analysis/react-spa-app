import { useLayoutEffect } from "react";
import type { SeoMetadataValues } from "@/config/seo-metadata";

const MANAGED_ATTR = "data-seo-managed";
const OPEN_GRAPH_PROPERTIES = [
  "og:title",
  "og:description",
  "og:image",
  "og:image:width",
  "og:image:height"
] as const;

const upsertMeta = (
  attributeName: "name" | "property",
  attributeValue: string,
  content: string
) => {
  const selector = `meta[${attributeName}="${attributeValue}"]`;
  const existing = document.head.querySelector(selector);

  if (existing instanceof HTMLMetaElement) {
    existing.setAttribute("content", content);
    return;
  }

  const meta = document.createElement("meta");
  meta.setAttribute(attributeName, attributeValue);
  meta.setAttribute("content", content);
  meta.setAttribute(MANAGED_ATTR, "true");
  document.head.appendChild(meta);
};

const removeManagedOpenGraph = () => {
  OPEN_GRAPH_PROPERTIES.forEach((property) => {
    document.head
      .querySelectorAll(`meta[${MANAGED_ATTR}="true"][property="${property}"]`)
      .forEach((element) => {
        element.remove();
      });
  });
};

export const SeoMetadata = ({
  title,
  description,
  openGraphTitle,
  openGraphDescription,
  openGraphImage
}: SeoMetadataValues) => {
  useLayoutEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);

    const hasOpenGraph =
      openGraphTitle !== undefined && openGraphDescription !== undefined;

    if (!hasOpenGraph) {
      removeManagedOpenGraph();
      return;
    }

    upsertMeta("property", "og:title", openGraphTitle);
    upsertMeta("property", "og:description", openGraphDescription);

    if (openGraphImage === undefined) {
      document.head
        .querySelectorAll(
          `meta[${MANAGED_ATTR}="true"][property="og:image"], meta[${MANAGED_ATTR}="true"][property="og:image:width"], meta[${MANAGED_ATTR}="true"][property="og:image:height"]`
        )
        .forEach((element) => {
          element.remove();
        });
      return;
    }

    upsertMeta("property", "og:image", openGraphImage);
    upsertMeta("property", "og:image:width", "600");
    upsertMeta("property", "og:image:height", "600");
  }, [
    title,
    description,
    openGraphTitle,
    openGraphDescription,
    openGraphImage
  ]);

  return null;
};
