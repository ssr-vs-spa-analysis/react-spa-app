export type SeoMetadataValues = {
  title: string;
  description: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
};

export const SEO_METADATA = {
  home: {
    title: "Početna | eProdavnica",
    description:
      "Preporučeni proizvodi i pretraga po kategorijama, brendovima i ceni."
  },
  search: {
    title: "Pretraga proizvoda | eProdavnica",
    description:
      "Pretraži proizvode po nazivu, kategoriji, brendu i opsegu cene."
  },
  missingProduct: {
    title: "Proizvod | eProdavnica",
    description: "Traženi proizvod nije pronađen."
  },
  routeError: {
    title: "Greška | eProdavnica",
    description: "Došlo je do greške pri učitavanju stranice."
  }
} as const satisfies Record<string, SeoMetadataValues>;
