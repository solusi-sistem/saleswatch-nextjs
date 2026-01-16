import { NextResponse } from 'next/server';
import { getGeoData } from '@/lib/getGeoData';

export async function GET(request: Request) {
    const geoData = await getGeoData();

    const redirectUrl =
        geoData.languages === 'id'
            ? new URL('/id', request.url)
            : new URL('/', request.url);

    const res = NextResponse.redirect(redirectUrl);

    res.cookies.set('geoData', JSON.stringify(geoData), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        httpOnly: true,
    });

    res.cookies.set('locale', geoData.languages === 'id' ? 'id' : 'en', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        httpOnly: false,
    });

    console.log('geoData', geoData);

    return res;
}
