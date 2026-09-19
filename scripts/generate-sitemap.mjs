import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PAGE_SIZE = 100;
const DEFAULT_API_URL = "http://localhost:3000";
const DEFAULT_SITE_URL = "http://localhost:5173";

export const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const toIsoDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
};

export const normalizeOrigin = (value) => value.replace(/\/+$/, "");

export const buildSitemapXml = (entries) => {
  const urls = entries
    .map((entry) => {
      const lastmod =
        entry.lastmod === undefined
          ? ""
          : `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`;
      return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${lastmod}
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};

export const buildRobotsTxt = (siteUrl) =>
  `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Sitemap: ${normalizeOrigin(siteUrl)}/sitemap.xml
`;

const fetchProductPage = async (apiUrl, offset) => {
  const url = new URL("/api/products", `${apiUrl}/`);
  url.searchParams.set("limit", String(PAGE_SIZE));
  url.searchParams.set("offset", String(offset));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Neuspešno preuzimanje proizvoda: ${response.status} ${response.statusText}`
    );
  }

  const payload = await response.json();
  if (!Array.isArray(payload.items) || typeof payload.total !== "number") {
    throw new Error("API odgovor za proizvode nema očekivani oblik.");
  }

  return payload;
};

export const collectSitemapEntries = async ({ siteUrl, apiUrl, fetchPage }) => {
  const origin = normalizeOrigin(siteUrl);
  const products = [];
  let offset = 0;
  let total = Infinity;

  while (offset < total) {
    const page = await fetchPage(apiUrl, offset);
    total = page.total;
    products.push(...page.items);
    if (page.items.length === 0) break;
    offset += PAGE_SIZE;
    if (page.items.length < PAGE_SIZE) break;
  }

  const uniqueProducts = new Map();
  products.forEach((product) => {
    if (typeof product.id !== "string" || product.id.trim() === "") return;
    uniqueProducts.set(product.id, product);
  });

  const productEntries = [...uniqueProducts.values()]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((product) => ({
      loc: `${origin}/product/${product.id}`,
      lastmod: toIsoDate(product.updatedAt),
      changefreq: "weekly",
      priority: "0.6"
    }));

  return [
    {
      loc: `${origin}/`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: "1.0"
    },
    {
      loc: `${origin}/search`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: "0.8"
    },
    ...productEntries
  ];
};

export const generateSitemapFiles = async ({
  siteUrl,
  apiUrl,
  publicDir,
  fetchPage = fetchProductPage
}) => {
  const entries = await collectSitemapEntries({ siteUrl, apiUrl, fetchPage });
  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(
    path.join(publicDir, "sitemap.xml"),
    buildSitemapXml(entries),
    "utf8"
  );
  await fs.writeFile(
    path.join(publicDir, "robots.txt"),
    buildRobotsTxt(siteUrl),
    "utf8"
  );

  return entries;
};

const isDirectRun = () => {
  const currentFile = fileURLToPath(import.meta.url);
  const invokedFile = process.argv[1];
  if (invokedFile === undefined) return false;
  return path.resolve(invokedFile) === currentFile;
};

if (isDirectRun()) {
  const rootDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    ".."
  );
  const siteUrl = process.env.SITEMAP_SITE_URL ?? DEFAULT_SITE_URL;
  const apiUrl =
    process.env.SITEMAP_API_URL ?? process.env.VITE_API_URL ?? DEFAULT_API_URL;

  generateSitemapFiles({
    siteUrl,
    apiUrl,
    publicDir: path.join(rootDir, "public")
  })
    .then((entries) => {
      console.log(
        `Generisana mapa sajta sa ${String(entries.length)} URL adresa.`
      );
    })
    .catch((error) => {
      console.error("Generisanje sitemap.xml nije uspelo.");
      console.error(error);
      process.exitCode = 1;
    });
}
