// SANITY PROXY FETCHER
// This function sends GROQ queries to our internal API route instead of hitting Sanity directly from the browser.
// This is a temporary fix to our freelancer's mistakes.
export async function proxyFetch<T>(query: string, params: any = {}): Promise<T | null> {
  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, params }),
    });

    if (!response.ok) {
      console.error(`Proxy Fetch Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("Sanity Proxy Network Error:", error);
    return null;
  }
}
