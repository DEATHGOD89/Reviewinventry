import { MetadataRoute } from "next";
import { INITIAL_19_PRODUCTS } from "@/lib/catalog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || "https://verispec.local";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/reviews`, lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/safety`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/glossary`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/accessibility`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/disclaimer`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];

  const productRoutes: MetadataRoute.Sitemap = INITIAL_19_PRODUCTS.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...productRoutes];
}
