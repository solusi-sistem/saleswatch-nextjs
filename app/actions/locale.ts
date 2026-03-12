'use server';

import { cookies } from 'next/headers';

/**
 * Set locale cookie when user manually switches language
 */
export async function setLocaleCookie(locale: 'en' | 'id') {
    const cookieStore = await cookies();

    cookieStore.set('locale', locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365 * 3, // 3 years
        sameSite: 'lax',
        httpOnly: false, // Allow client-side access if needed
    });

    return { success: true };
}
