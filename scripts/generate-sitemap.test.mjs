import assert from "node:assert/strict";
import test from "node:test";
import {
  buildRobotsTxt,
  buildSitemapXml,
  collectSitemapEntries,
  escapeXml,
  normalizeOrigin
} from "./generate-sitemap.mjs";

test("escapeXml zamenjuje XML specijalne znakove", () => {
  assert.equal(
    escapeXml(`<a href="x">&y'</a>`),
    "&lt;a href=&quot;x&quot;&gt;&amp;y&apos;&lt;/a&gt;"
  );
});

test("normalizeOrigin uklanja završne kose crte", () => {
  assert.equal(normalizeOrigin("https://csr.example/"), "https://csr.example");
});

test("buildRobotsTxt uključuje apsolutnu adresu mape sajta", () => {
  assert.match(
    buildRobotsTxt("https://csr.example/"),
    /Sitemap: https:\/\/csr\.example\/sitemap\.xml/
  );
});

test("collectSitemapEntries uklanja duplikate i sortira proizvode", async () => {
  const entries = await collectSitemapEntries({
    siteUrl: "https://csr.example",
    apiUrl: "https://api.example",
    fetchPage: async () => ({
      total: 2,
      items: [
        { id: "b", updatedAt: "2026-09-01T00:00:00.000Z" },
        { id: "a", updatedAt: "2026-09-02T00:00:00.000Z" },
        { id: "a", updatedAt: "2026-09-03T00:00:00.000Z" }
      ]
    })
  });

  const xml = buildSitemapXml(entries);
  assert.equal(entries[0].loc, "https://csr.example/");
  assert.equal(entries[1].loc, "https://csr.example/search");
  assert.deepEqual(
    entries.slice(2).map((entry) => entry.loc),
    ["https://csr.example/product/a", "https://csr.example/product/b"]
  );
  assert.match(xml, /<priority>1\.0<\/priority>/);
  assert.match(xml, /product\/a/);
});
