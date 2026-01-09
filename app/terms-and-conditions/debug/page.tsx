'use client';

import { useEffect, useState } from 'react';
import { useTermsConditions } from '@/contexts/TermsConditionsContext';
import { getTermsConditionsData } from '@/lib/sanity.termsConditions';
import type { TermsConditionsSection } from '@/types/termsConditions';

export default function TermsConditionsDebugPage() {
  const { data: contextData, loading: contextLoading, error: contextError, refetch } = useTermsConditions();
  const [directData, setDirectData] = useState<TermsConditionsSection | null>(null);
  const [directLoading, setDirectLoading] = useState(true);
  const [directError, setDirectError] = useState<string | null>(null);

  useEffect(() => {
    // Direct fetch test
    const fetchDirect = async () => {
      try {
        setDirectLoading(true);
        const result = await getTermsConditionsData();
        setDirectData(result);
        setDirectError(null);
      } catch (err) {
        setDirectError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setDirectLoading(false);
      }
    };
    fetchDirect();
  }, []);

  const hasContextData = !!contextData;
  const hasDirectData = !!directData;
  const contextItemsCount = contextData?.terms_and_conditions_content?.items?.length || 0;
  const directItemsCount = directData?.terms_and_conditions_content?.items?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-6 shadow-2xl">
          <h1 className="text-4xl font-bold mb-2">🔍 Terms & Conditions Debug</h1>
          <p className="text-blue-100">Comprehensive debugging information for Terms & Conditions data</p>
        </div>

        {/* Quick Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`rounded-xl p-6 ${hasContextData ? 'bg-green-600' : 'bg-red-600'}`}>
            <div className="text-3xl mb-2">{hasContextData ? '✅' : '❌'}</div>
            <div className="text-sm opacity-90">Context Status</div>
            <div className="text-2xl font-bold">{hasContextData ? 'Data Loaded' : 'No Data'}</div>
          </div>

          <div className={`rounded-xl p-6 ${contextItemsCount > 0 ? 'bg-green-600' : 'bg-yellow-600'}`}>
            <div className="text-3xl mb-2">📋</div>
            <div className="text-sm opacity-90">Terms Items</div>
            <div className="text-2xl font-bold">{contextItemsCount} Items</div>
          </div>

          <div className={`rounded-xl p-6 ${!contextError ? 'bg-green-600' : 'bg-red-600'}`}>
            <div className="text-3xl mb-2">{!contextError ? '✅' : '❌'}</div>
            <div className="text-sm opacity-90">Error Status</div>
            <div className="text-2xl font-bold">{contextError ? 'Has Errors' : 'No Errors'}</div>
          </div>

          <div className={`rounded-xl p-6 ${!contextLoading ? 'bg-green-600' : 'bg-blue-600'}`}>
            <div className="text-3xl mb-2">{!contextLoading ? '✅' : '⏳'}</div>
            <div className="text-sm opacity-90">Loading Status</div>
            <div className="text-2xl font-bold">{contextLoading ? 'Loading...' : 'Complete'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Context Status */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              📡 Context Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="text-white/70">Loading:</span>
                <span className={`font-semibold ${contextLoading ? 'text-yellow-400' : 'text-green-400'}`}>
                  {contextLoading ? '⏳ Loading...' : '✅ Complete'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="text-white/70">Has Data:</span>
                <span className={`font-semibold ${hasContextData ? 'text-green-400' : 'text-red-400'}`}>
                  {hasContextData ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="text-white/70">Error:</span>
                <span className={`font-semibold ${contextError ? 'text-red-400' : 'text-green-400'}`}>
                  {contextError || 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Direct Fetch Test */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🎯 Direct Fetch Test
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="text-white/70">Loading:</span>
                <span className={`font-semibold ${directLoading ? 'text-yellow-400' : 'text-green-400'}`}>
                  {directLoading ? '⏳ Loading...' : '✅ Complete'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="text-white/70">Has Data:</span>
                <span className={`font-semibold ${hasDirectData ? 'text-green-400' : 'text-red-400'}`}>
                  {hasDirectData ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="text-white/70">Error:</span>
                <span className={`font-semibold ${directError ? 'text-red-400' : 'text-green-400'}`}>
                  {directError || 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Refetch Button */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20 text-center">
          <button
            onClick={() => refetch()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            🔄 Refetch Data
          </button>
        </div>

        {/* Data Structure */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-4">📊 Data Structure</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/20">
              <span className="text-white/70">Section ID:</span>
              <span className="font-mono text-sm">{contextData?._id || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/20">
              <span className="text-white/70">Section Name:</span>
              <span className="font-semibold">{contextData?.name_section || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/20">
              <span className="text-white/70">Type:</span>
              <span className="font-semibold">{contextData?.type_section || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/20">
              <span className="text-white/70">Published:</span>
              <span className={`font-semibold ${contextData?.published_at ? 'text-green-400' : 'text-red-400'}`}>
                {contextData?.published_at ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/20">
              <span className="text-white/70">Has Content:</span>
              <span className={`font-semibold ${contextData?.terms_and_conditions_content ? 'text-green-400' : 'text-red-400'}`}>
                {contextData?.terms_and_conditions_content ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/20">
              <span className="text-white/70">Items Count:</span>
              <span className="font-semibold text-yellow-400">{contextItemsCount}</span>
            </div>
          </div>
        </div>

        {/* Items List */}
        {contextData?.terms_and_conditions_content?.items && contextData.terms_and_conditions_content.items.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
            <h2 className="text-2xl font-bold mb-4">📝 Terms & Conditions Items</h2>
            <div className="space-y-3">
              {contextData.terms_and_conditions_content.items.map((item, index) => (
                <div key={item._id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-lg mb-1">
                        {index + 1}. {item.title.en}
                      </div>
                      <div className="text-sm text-white/70">ID: {item._id}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.published_at ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      {item.published_at ? 'Published' : 'Draft'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                    <div>
                      <span className="text-white/70">EN Content:</span>
                      <span className="ml-2 font-semibold">
                        {item.content_en?.length || 0} blocks
                      </span>
                    </div>
                    <div>
                      <span className="text-white/70">ID Content:</span>
                      <span className="ml-2 font-semibold">
                        {item.content_id?.length || 0} blocks
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Environment Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-4">⚙️ Environment</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/20">
              <span className="text-white/70">Node Environment:</span>
              <span className="font-mono text-sm">{process.env.NODE_ENV}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/20">
              <span className="text-white/70">Has Sanity Project ID:</span>
              <span className={`font-semibold ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? 'text-green-400' : 'text-red-400'}`}>
                {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/20">
              <span className="text-white/70">Has Sanity Dataset:</span>
              <span className={`font-semibold ${process.env.NEXT_PUBLIC_SANITY_DATASET ? 'text-green-400' : 'text-red-400'}`}>
                {process.env.NEXT_PUBLIC_SANITY_DATASET ? '✅ Yes' : '❌ No'}
              </span>
            </div>
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-yellow-500/30">
          <h2 className="text-2xl font-bold mb-4">💡 Troubleshooting Guide</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-yellow-300 mb-2">If "No Data" or 0 Items:</h3>
              <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                <li>Check if section exists in Sanity with type_section = "termsAndConditionsSection"</li>
                <li>Ensure published_at = true for the section</li>
                <li>Verify terms_and_conditions_content field has items array</li>
                <li>Check if items are referenced (not embedded)</li>
                <li>Ensure list_terms_and_conditions documents have published_at = true</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-300 mb-2">Test in Sanity Vision:</h3>
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto text-xs">
{`*[_type == "section" && type_section == "termsAndConditionsSection"] {
  _id,
  name_section,
  published_at,
  terms_and_conditions_content {
    items[]-> {
      _id,
      title,
      published_at
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Raw JSON Data */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-4">📄 Raw JSON Data</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-blue-300">Context Data:</h3>
              <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs text-green-300">
                {JSON.stringify(contextData, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-purple-300">Direct Fetch Data:</h3>
              <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs text-green-300">
                {JSON.stringify(directData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}