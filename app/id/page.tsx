import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPageData } from '@/hooks/getPageData';
import { Metadata } from 'next';
import { PageProps } from '@/types/page';
import Link from 'next/link';
import { isPagePublished, isSectionPublished } from '@/lib/isPublished';
import { renderSection } from '@/contexts/renderSection';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate Metadata untuk SEO (SSR)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? `/${resolvedParams.slug}` : '/';
  const pageData = await getPageData(slug);

  if (!pageData) {
    return {
      title: 'Halaman Tidak Ditemukan',
      description: 'Halaman yang Anda cari tidak dapat ditemukan.',
    };
  }

  const title =
    pageData?.seo_title?.seo_title_id ||
    pageData?.name_page ||
    'Halaman Tanpa Judul';

  const description =
    pageData?.seo_description?.seo_description_id || '';

  const keywords =
    pageData?.seo_keyword?.seo_keyword_id || '';

  const imageUrl =
    pageData?.seo_icon?.secure_url || pageData?.seo_icon?.url;

  return {
    title,
    description,
    keywords,
    robots: 'index, follow',
    openGraph: {
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
    icons: imageUrl
      ? {
        icon: [{ url: imageUrl }],
        shortcut: [{ url: imageUrl }],
        apple: [{ url: imageUrl }],
      }
      : undefined,
  };
}

export default async function IndonesianPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? `/${resolvedParams.slug}` : '/';
  const pageData = await getPageData(slug);

  // Check cookie - jika user pilih bahasa Inggris, redirect ke English version
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale');
  
  // ✅ HANYA redirect jika user memilih English
  if (localeCookie?.value === 'en') {
    redirect('/');
  }

  // ❌ HAPUS BAGIAN INI - PENYEBAB LOOP!
  // if (localeCookie?.value === 'id') {
  //   redirect('/id');
  // }
  //
  // if (!localeCookie) {
  //   const geoData = await getGeoData();
  //   if (geoData.languages === 'id') {
  //     redirect('/id');
  //   }
  // }

  // Jika data tidak ditemukan
  if (!pageData) {
    return (
      <>
        <Header />
        <section
          className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100"
          style={{
            background: 'linear-gradient(135deg, #007BFF 0%, #003580 100%)',
            padding: '100px 20px',
          }}
        >
          <div className="mb-4">
            <i
              className="bi bi-emoji-frown"
              style={{
                fontSize: '5rem',
                color: 'white',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            ></i>
          </div>

          <h1 className="text-white fw-bold mb-3">
            Halaman Tidak Ditemukan
          </h1>

          <p className="text-white-50 fs-5 mb-4" style={{ maxWidth: '600px' }}>
            Maaf, kami tidak dapat menemukan halaman yang Anda cari.
            Halaman tersebut mungkin telah dipindahkan atau dihapus.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link href="/id" className="btn btn-outline-light btn-lg fw-semibold">
              Kembali ke Beranda
            </Link>
          </div>

          <div
            className="position-absolute bottom-0 start-0 end-0"
            style={{
              height: '150px',
              background: 'rgba(255,255,255,0.05)',
              clipPath: 'polygon(0 70%, 100% 0, 100% 100%, 0 100%)',
            }}
          ></div>
        </section>
        <Footer />
      </>
    );
  }

  // Cek apakah halaman sudah dipublikasikan
  if (!isPagePublished(pageData)) {
    return (
      <>
        <Header />
        <div
          className="w-100 min-vh-100 d-flex flex-column justify-content-center align-items-center"
          style={{
            background: 'linear-gradient(180deg, #2D86FF 0%, #033AA7 100%)',
            paddingTop: '150px',
            paddingBottom: '150px',
          }}
        >
          <div className="text-center">
            <h1 className="fs-1 text-white fw-bold mb-3">
              Halaman Ini Belum Dipublikasikan
            </h1>
            <p className="text-white mb-4 fs-4">
              Maaf, halaman yang Anda cari belum tersedia saat ini.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link
                href="/id"
                className="btn btn-outline-light px-4 py-2 fw-semibold fs-5"
                style={{
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                }}
              >
                Kembali ke Halaman Utama
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Filter section yang sudah dipublikasikan
  const publishedSections =
    pageData?.section_list?.filter(section =>
      isSectionPublished(section)
    ) || [];

  return (
    <div lang="id">
      <Header />
      {publishedSections.length > 0 ? (
        publishedSections.map((section, index) =>
          renderSection(section, index)
        )
      ) : (
        <div
          className="min-vh-100 flex items-center justify-center relative"
          style={{
            paddingTop: '300px',
            paddingBottom: '200px',
            transition: 'all 1s ease-in-out',
          }}
        >
          <h1 className="fs-4 text-black fw-semibold">
            Tidak Ada Konten yang Tersedia
          </h1>
        </div>
      )}
      <Footer />
    </div>
  );
}