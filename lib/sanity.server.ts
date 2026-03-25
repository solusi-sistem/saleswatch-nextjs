import { createClient } from "next-sanity";

export const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false, // For server-side, FALSE is better because Vercel caches it anyway
  token: process.env.SANITY_API_TOKEN, 
});

// to do:
const MASTER_PAGE_QUERY = `
{

}
`;

export async function masterServerFetch<T>(query: string, params: any = {}): Promise<T | null> {
  try {
    const data = await serverClient.fetch<T>(query, params, {
      next: { revalidate: 86400 } // Use this to bake the page for 24 hours
      // cache: 'no-store' // Use this if you want it fresh every single time
    });

    if (!data) {
      console.warn(`⚠️ Query returned no data for slug: ${params.slug || 'N/A'}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error("❌ Sanity Server Fetch Critical Error:", error);
    
    // Returning null allows page.tsx to show a "Friendly" error instead of a crash
    return null;
  }
}
