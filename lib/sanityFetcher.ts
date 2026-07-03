// SANITY PROXY FETCHER
// This function sends GROQ queries to our internal API route instead of hitting Sanity directly from the browser.
// This is a temporary fix to our freelancer's mistakes.

const CACHE_PREFIX = "sanity_cache_";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * Robust client-side fetcher with sessionStorage caching to survive page refreshes
 * during the session and minimize API calls.
 */
export async function proxyFetch<T>(
	query: string,
	params: any = {},
): Promise<T | null> {
	try {
		const isBrowser = typeof window !== "undefined";
		const cacheKey =
			CACHE_PREFIX + btoa(JSON.stringify({ query, params })).substring(0, 50);

		if (isBrowser) {
			try {
				const cached = sessionStorage.getItem(cacheKey);
				if (cached) {
					const { data, timestamp } = JSON.parse(cached);
					if (Date.now() - timestamp < CACHE_DURATION) {
						// console.log("Serving from session cache");
						return data as T;
					}
				}
			} catch (e) {
				// Silently fail cache read
			}
		}

		const response = await fetch("/api/query", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query, params }),
		});

		if (!response.ok) {
			console.error(
				`Proxy Fetch Error: ${response.status} ${response.statusText}`,
			);
			return null;
		}

		const data = await response.json();

		if (isBrowser && data) {
			try {
				sessionStorage.setItem(
					cacheKey,
					JSON.stringify({
						data,
						timestamp: Date.now(),
					}),
				);
			} catch (e) {
				// Handle quota exceeded or other storage errors
				if (e instanceof DOMException && e.name === "QuotaExceededError") {
					sessionStorage.clear(); // Emergency clear if full
				}
			}
		}

		return data as T;
	} catch (error) {
		console.error("Sanity Proxy Network Error:", error);
		return null;
	}
}
