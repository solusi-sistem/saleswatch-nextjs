import Header from '@/components/layouts/Header';
import HeroUtama from '@/components/Sections/Hero/HeroUtama';
import TestimoniSection from '@/contexts/home/TestimoniContext';
import StoryVisionMission from '@/components/Sections/About/StoryVisionMission';
import WhyItWorks from '@/components/Sections/About/WhyItWorks';
import Faq from '@/components/Sections/Faq/Faq';
import RequestDemoSection from './home/RequestDemoSection';
import Blog from '@/components/Sections/Blog/Blog';
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

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate Metadata untuk SEO (SSR)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Await params karena sekarang adalah Promise di Next.js 15+
  const resolvedParams = await params;
  console.log("resolvedParams", resolvedParams);
  const slug = resolvedParams.slug ? `/${resolvedParams.slug}` : '/';
  console.log("slug", slug);
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

export default async function EnglishPage({ params }: PageProps) {
  // Await params karena sekarang adalah Promise di Next.js 15+
  const resolvedParams = await params;
  console.log('Resolved Params:', resolvedParams);
  const slug = resolvedParams.slug ? `/${resolvedParams.slug}` : '/';
  console.log('Slug:', slug);
  const pageData = await getPageData(slug);

  // Jika data tidak ditemukan
  if (!pageData) {
    return (
      <>
        <Header />
        <section
          className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100"
          style={{
            background: "linear-gradient(135deg, #007BFF 0%, #003580 100%)",
            padding: "100px 20px",
          }}
        >
          <div className="mb-4">
            <i
              className="bi bi-emoji-frown"
              style={{
                fontSize: "5rem",
                color: "white",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            ></i>
          </div>

          <h1 className="text-white fw-bold mb-3">
            Page Not Found
          </h1>

          <p className="text-white-50 fs-5 mb-4" style={{ maxWidth: "600px" }}>
            Sorry, we couldn't find the page you're looking for. The page may have been moved or deleted.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link href="/" className="btn btn-outline-light btn-lg fw-semibold">
              Back to Home
            </Link>
          </div>

          <div
            className="position-absolute bottom-0 start-0 end-0"
            style={{
              height: "150px",
              background: "rgba(255,255,255,0.05)",
              clipPath: "polygon(0 70%, 100% 0, 100% 100%, 0 100%)",
            }}
          ></div>
        </section>
        <Footer />
      </>
    );
  }

  // Cek apakah page sudah dipublikasi
  if (!isPagePublished(pageData)) {
    return (
      <>
        <Header />
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
        <Footer />
      </>
    );
  }

  // Filter section yang sudah published
  const publishedSections = pageData?.section_list?.filter(section =>
    isSectionPublished(section)
  ) || [];

  // ⚠️ cookies() DI NEXT 15+ HARUS await
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale');

  // 🛑 Hormati pilihan user
  if (localeCookie?.value === 'id') {
    redirect('/id');
  }

  // 🌍 First visit → geo check
  if (!localeCookie) {
    const geoData = await getGeoData();

    if (geoData.languages === 'id') {
      redirect('/id');
    }
  }

  // 🇬🇧 Default English SSR
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
