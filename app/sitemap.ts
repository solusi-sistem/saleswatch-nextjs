import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.saleswatch.id";
  const idBaseUrl = "https://www.saleswatch.id/id";

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}`,
          id: `${idBaseUrl}`,
        },
      },
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/features`,
          id: `${idBaseUrl}/features`,
        },
      },
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/blog`,
          id: `${idBaseUrl}/blog`,
        },
      },
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/faq`,
          id: `${idBaseUrl}/faq`,
        },
      },
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/support`,
          id: `${idBaseUrl}/support`,
        },
      },
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/terms-and-conditions`,
          id: `${idBaseUrl}/terms-and-conditions`,
        },
      },
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/privacy-policy`,
          id: `${idBaseUrl}/privacy-policy`,
        },
      },
    },
  ];
}
