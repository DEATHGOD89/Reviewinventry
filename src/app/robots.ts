import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://verispec.local";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/compare", "/reviews", "/safety", "/glossary", "/accessibility", "/terms", "/privacy"],
        disallow: ["/admin", "/management", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
