import { headers } from "next/headers";

export interface GeoData {
    ip: string;
    country: string;
    country_name: string;
    city: string;
    region: string;
    currency: string;
    languages: string;
    timezone: string;
    latitude: string;
    longitude: string;
}

export async function getGeoData(): Promise<GeoData> {
    try {
        const headersList = await headers();

        // Vercel Geo Headers
        const country = headersList.get("x-vercel-ip-country") ?? "US";
        const countryRegion = headersList.get("x-vercel-ip-country-region") ?? "Unknown";
        const city = headersList.get("x-vercel-ip-city") ?? "Unknown";
        const timezone = headersList.get("x-vercel-ip-timezone") ?? "UTC";
        const latitude = headersList.get("x-vercel-ip-latitude") ?? "";
        const longitude = headersList.get("x-vercel-ip-longitude") ?? "";

        // IP Address
        const forwardedFor = headersList.get("x-forwarded-for");
        const realIp = headersList.get("x-real-ip");

        const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "Unknown";

        // Currency Map
        const currencyMap: Record<string, string> = {
            ID: "IDR",
            US: "USD",
            GB: "GBP",
            EU: "EUR",
            JP: "JPY",
            SG: "SGD",
            MY: "MYR",
            // Tambahkan negara lain sesuai kebutuhan
        };

        // Country Name Map
        const countryNameMap: Record<string, string> = {
            ID: "Indonesia",
            US: "United States",
            GB: "United Kingdom",
            SG: "Singapore",
            MY: "Malaysia",
            // Tambahkan negara lain sesuai kebutuhan
        };

        // Language detection based on country
        const languages = country === "ID" ? "id" : "en";

        return {
            ip,
            country,
            country_name: countryNameMap[country] ?? country,
            city: decodeURIComponent(city),
            region: decodeURIComponent(countryRegion),
            currency: currencyMap[country] || "USD",
            languages,
            timezone,
            latitude,
            longitude,
        };
    } catch (error) {
        console.error("Error fetching geo data:", error);
        return {
            ip: "Unknown",
            country: "US",
            country_name: "United States",
            city: "Unknown",
            region: "Unknown",
            currency: "USD",
            languages: "en",
            timezone: "UTC",
            latitude: "",
            longitude: "",
        };
    }
}