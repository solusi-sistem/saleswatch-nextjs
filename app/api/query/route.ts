import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function POST(request: Request) {
  try {
    const { query, params } = await request.json();
    
    // execute fetch on server
    const data = await client.fetch(query, params || {}, {
      next: { 
        revalidate: 86400 // 24 hours caching on Vercel
      }
    });
    
    // return data to browser
    return NextResponse.json(data);
  } catch (error) {
    console.error('Sanity Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Sanity' }, 
      { status: 500 }
    );
  }
}
