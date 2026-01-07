import { getGeoData } from '@/lib/getGeoData';
import Link from 'next/link';

export default async function DebugPage() {
  const geoData = await getGeoData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061551] to-[#0a1d6b] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-6 text-center">🌍 Geographic Debug Information</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-[#CFE3C0]">📍 Location Details</h2>
              <div className="space-y-3">
                <InfoRow label="IP Address" value={geoData.ip} />
                <InfoRow label="Country Code" value={geoData.country} />
                <InfoRow label="Country Name" value={geoData.country_name} />
                <InfoRow label="City" value={geoData.city} />
                <InfoRow label="Region" value={geoData.region} />
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-[#CFE3C0]">🌐 Regional Settings</h2>
              <div className="space-y-3">
                <InfoRow label="Language" value={geoData.languages} />
                <InfoRow label="Currency" value={geoData.currency} />
                <InfoRow label="Timezone" value={geoData.timezone} />
                <InfoRow label="Latitude" value={geoData.latitude || 'N/A'} />
                <InfoRow label="Longitude" value={geoData.longitude || 'N/A'} />
              </div>
            </div>
          </div>

          <div className="bg-[#6587A8]/20 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">🔀 Redirect Logic</h2>
            <p className="text-sm mb-2">Based on your location, you should be redirected to:</p>
            <div className="text-2xl font-bold text-[#CFE3C0]">
              /{geoData.languages === 'id' ? 'id' : 'en'}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/en" 
              className="bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#061551] px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              🇺🇸 Go to English Version
            </Link>
            <Link 
              href="/id" 
              className="bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#061551] px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              🇮🇩 Go to Indonesian Version
            </Link>
            <Link 
              href="/" 
              className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              🏠 Test Auto-Redirect
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-white/60">
            <p>💡 Tip: This page shows the geographic data detected by Vercel Edge Network</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-white/10 pb-2">
      <span className="text-white/70">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}