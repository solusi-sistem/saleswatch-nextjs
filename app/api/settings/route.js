import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const revalidate = 86400 * 365;

export async function GET() {
  try {
    const settings = await client.fetch(
      `*[_type == "websiteSettings"][0]{
        emailSettings {
          smtp {
            host,
            port,
            username,
            password,
            encryption,
            fromAddress,
            fromName
          },
          adminEmails[isActive == true]{
            email,
            name,
            isActive
          }
        }
      }`,
      {},
      { next: { revalidate: 86400 * 365} }
    );

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings not found. Please configure in Sanity CMS.' },
        { status: 404 }
      );
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
