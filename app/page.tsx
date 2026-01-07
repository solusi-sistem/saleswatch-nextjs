import { redirect } from 'next/navigation';
import { getGeoData } from '@/lib/getGeoData';

export default async function RootPage() {
  const geoData = await getGeoData();
  
  // Redirect berdasarkan bahasa yang terdeteksi
  const targetLocale = geoData.languages === 'id' ? 'id' : 'en';
  
  redirect(`/${targetLocale}`);
}