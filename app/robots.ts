import type { MetadataRoute } from "next";

/** Public gear is indexable; staff desk stays out of search results. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/rent", "/rent/"],
        disallow: ["/owner", "/owner/", "/manager", "/manager/", "/login"],
      },
    ],
  };
}
