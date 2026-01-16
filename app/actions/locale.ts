'use server';

import { cookies } from 'next/headers';
import type { GeoData } from '@/lib/getGeoData';

export async function setLocaleCookie(locale: 'en' | 'id') {
    const cookieStore = await cookies();

    cookieStore.set('locale', locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
        httpOnly: false, // Allow client-side access if needed
    });

    return { success: true };
}

export async function getLocaleCookie(): Promise<string | null> {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get('locale');
    return localeCookie?.value || null;
}

export async function setGeoDataCookie(geoData: GeoData) {
    const cookieStore = await cookies();

    // Store geo data as JSON string
    cookieStore.set('geoData', JSON.stringify(geoData), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
        httpOnly: true,
    });

    return { success: true };
}

export async function getGeoDataCookie(): Promise<GeoData | null> {
    const cookieStore = await cookies();
    const geoDataCookie = cookieStore.get('geoData');

    if (!geoDataCookie?.value) {
        return null;
    }

    try {
        return JSON.parse(geoDataCookie.value) as GeoData;
    } catch {
        return null;
    }
}