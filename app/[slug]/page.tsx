import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getGeoData } from '@/lib/getGeoData';
import { getPageData } from '@/hooks/getPageData';
import { Metadata } from "next";
import { PageProps } from "@/types/page";
import Link from 'next/link';
import { isPagePublished, isSectionPublished } from '@/lib/isPublished';
import { renderSection } from '@/contexts/renderSection';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = `/${resolvedParams.slug}`;
  const pageData = await getPageData(slug);

  if (!pageData) {
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for could not be found.',
    };
  }

  const title = pageData?.seo_title?.seo_title_en || pageData?.name_page || 'Untitled Page';
  const description = pageData?.seo_description?.seo_description_en || '';
  const keywords = pageData?.seo_keyword?.seo_keyword_en || '';
  const imageUrl = pageData?.seo_icon?.secure_url || pageData?.seo_icon?.url;

  return {
    title,
    description,
    keywords,
    robots: "index, follow",
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

export default async function EnglishSlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = `/${resolvedParams.slug}`;

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale');

  if (localeCookie?.value === 'id') {
    redirect(`/id${slug}`);
  }

  if (!localeCookie) {
    const geoData = await getGeoData();
    if (geoData.languages === 'id') {
      redirect(`/id${slug}`);
    }
  }

  const pageData = await getPageData(slug);

  if (!pageData) {
    return (
      <>
        {/* <Header /> */}
        <section className="min-h-screen bg-[#f2f7ff] flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wider mb-4">
              KESALAHAN: HALAMAN TIDAK DITEMUKAN
            </p>
            
            <h1 className="text-[120px] md:text-[180px] font-black text-gray-800 leading-none mb-6">
              404
            </h1>
            
            <p className="text-gray-700 text-lg mb-8">
              Halaman ini tidak tersedia.
            </p>

            <Link 
              href="/" 
              className="inline-block bg-gray-800 text-white font-semibold px-8 py-3 rounded-full 
                         hover:bg-gray-900 transition-all duration-200 hover:shadow-lg"
            >
              Pergi ke beranda
            </Link>
          </div>
        </section>
        {/* <Footer /> */}
      </>
    );
  }

  if (!isPagePublished(pageData)) {
    return (
      <>
        {/* <Header /> */}
        <div
          className="w-100 min-vh-100 d-flex flex-column justify-content-center align-items-center"
          style={{
            background: "linear-gradient(180deg, #2D86FF 0%, #033AA7 100%)",
            paddingTop: "150px",
            paddingBottom: "150px",
          }}
        >
          <div className="text-center">
            <h1 className="fs-1 text-white fw-bold mb-3">
              This Page Is Not Published Yet
            </h1>
            <p className="text-white mb-4 fs-4">
              Sorry, the page you are looking for is not available at the moment.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link
                href="/"
                className="btn btn-outline-light px-4 py-2 fw-semibold fs-5"
                style={{
                  borderRadius: "8px",
                  transition: "all 0.3s ease"
                }}
              >
                Go to Home Page
              </Link>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }

  const publishedSections = pageData?.section_list?.filter(section =>
    isSectionPublished(section)
  ) || [];

  return (
    <div lang="en">
      <Header />
      {publishedSections.length > 0 ? (
        publishedSections.map((section, index) =>
          renderSection(section, index)
        )
      ) : (
        <div
          className="min-vh-100 flex items-center justify-center relative"
          style={{
            paddingTop: "300px",
            paddingBottom: "200px",
            transition: "all 1s ease-in-out"
          }}
        >
          <h1 className="fs-4 text-black fw-semibold">
            No Sections Available
          </h1>
        </div>
      )}
      <Footer />
    </div>
  );
}