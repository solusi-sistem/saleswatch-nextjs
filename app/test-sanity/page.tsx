'use client';

import { useEffect, useState } from 'react';
import { getLayoutData, urlFor } from '@/lib/sanity';

export default function TestSanity() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [headerLogoUrl, setHeaderLogoUrl] = useState<string | null>(null);
  const [footerLogoUrl, setFooterLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function test() {
      try {
        console.log('Testing Sanity connection...');
        const result = await getLayoutData();
        setData(result);

        // Debug Header Logo
        console.log('📍 Header Logo Object:', result?.header?.logo);
        if (result?.header?.logo) {
          try {
            const headerUrl = urlFor(result.header.logo).width(170).fit('max').auto('format').url();
            console.log('✅ Header Logo URL Generated:', headerUrl);
            setHeaderLogoUrl(headerUrl);
          } catch (err) {
            console.error('❌ Error generating header logo URL:', err);
          }
        } else {
          console.warn('⚠️ No header logo data found');
        }

        // Debug Footer Logo
        console.log('📍 Footer Logo Object:', result?.footer?.logo_footer);
        if (result?.footer?.logo_footer) {
          try {
            const footerUrl = urlFor(result.footer.logo_footer).width(170).fit('max').auto('format').url();
            console.log('✅ Footer Logo URL Generated:', footerUrl);
            setFooterLogoUrl(footerUrl);
          } catch (err) {
            console.error('❌ Error generating footer logo URL:', err);
          }
        } else {
          console.warn('⚠️ No footer logo data found');
        }
      } catch (err: any) {
        console.error('❌ Test error:', err);
        setError(err.message);
      }
    }
    test();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Sanity Logo Test (Header & Footer)</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="space-y-2 font-mono text-sm">
          <div>
            <strong>Project ID:</strong> {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '❌ Missing'}
          </div>
          <div>
            <strong>Dataset:</strong> {process.env.NEXT_PUBLIC_SANITY_DATASET || '❌ Missing'}
          </div>
          <div>
            <strong>API Version:</strong> {process.env.NEXT_PUBLIC_SANITY_API_VERSION || '❌ Missing'}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Raw Layout Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {/* Header Logo */}
      <div className="bg-blue-50 p-6 rounded-lg shadow mb-6 border-l-4 border-blue-500">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">📸 Header Logo</h2>
        {data?.header?.logo && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Raw Object:</strong>
            </p>
            <pre className="bg-white p-3 rounded text-xs overflow-auto border">
              {JSON.stringify(data.header.logo, null, 2)}
            </pre>
          </div>
        )}
        {headerLogoUrl ? (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Generated URL:</strong>
            </p>
            <div className="text-sm text-blue-600 break-all mb-4 bg-white p-3 rounded border">
              {headerLogoUrl}
            </div>
            <img src={headerLogoUrl} alt="Header Logo" className="h-16 border rounded" />
          </div>
        ) : (
          <div className="text-yellow-600 bg-yellow-50 p-3 rounded">
            ⚠️ Header logo URL not generated
          </div>
        )}
      </div>

      {/* Footer Logo */}
      <div className="bg-green-50 p-6 rounded-lg shadow border-l-4 border-green-500">
        <h2 className="text-xl font-semibold mb-4 text-green-900">🖼️ Footer Logo</h2>
        {data?.footer?.logo_footer && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Raw Object:</strong>
            </p>
            <pre className="bg-white p-3 rounded text-xs overflow-auto border">
              {JSON.stringify(data.footer.logo_footer, null, 2)}
            </pre>
          </div>
        )}
        {footerLogoUrl ? (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Generated URL:</strong>
            </p>
            <div className="text-sm text-green-600 break-all mb-4 bg-white p-3 rounded border">
              {footerLogoUrl}
            </div>
            <img src={footerLogoUrl} alt="Footer Logo" className="h-16 border rounded" />
          </div>
        ) : (
          <div className="text-yellow-600 bg-yellow-50 p-3 rounded">
            ⚠️ Footer logo URL not generated
          </div>
        )}
      </div>

      {!data && !error && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      )}
    </div>
  );
}