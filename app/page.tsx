import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

import { getPageData } from '@/hooks/getPageData';
import { Metadata } from 'next';
import { PageProps } from '@/types/page';
import Link from 'next/link';
import { isPagePublished, isSectionPublished } from '@/lib/isPublished';
import { renderSection } from '@/contexts/renderSection';
// REMOVED: cookies, redirect, getGeoData (moved to middleware)

// Force dynamic rendering
// export const dynamic = 'force-dynamic'; <--- commented because it causes sanity CMS API request number to spike when a bot crawls the page
export const revalidate = 3600;

// Generate Metadata untuk SEO (SSR)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? `/${resolvedParams.slug}` : '/';
  const pageData = await getPageData(slug);

  if (!pageData) {
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for cannot be found.',
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
    robots: 'index, follow',
    openGraph: { title, description, images: imageUrl ? [imageUrl] : [] },
    twitter: { card: 'summary_large_image', title, description, images: imageUrl ? [imageUrl] : [] },
    icons: imageUrl ? { icon: [{ url: imageUrl }] } : undefined,
  };
}

export default async function EnglishPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? `/${resolvedParams.slug}` : '/';

  // (middleware.ts file now handles checking cookies and redirecting to /id or /api/geo)

  const pageData = await getPageData(slug);

  // If data is not found
  if (!pageData) {
    return (
      <>
        <Header />
        <section className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100" style={{ background: 'linear-gradient(135deg, #007BFF 0%, #003580 100%)', padding: '100px 20px' }}>
          <div className="mb-4"><i className="bi bi-emoji-frown" style={{ fontSize: '5rem', color: 'white' }}></i></div>
          <h1 className="text-white fw-bold mb-3">Page Not Found</h1>
          <p className="text-white-50 fs-5 mb-4">Sorry, we couldn't find the page you were looking for.</p>
          <Link href="/" className="btn btn-outline-light btn-lg fw-semibold">Return to Home</Link>
        </section>
        <Footer />
      </>
    );
  }

  // Check if published
  if (!isPagePublished(pageData)) {
    return (
      <>
        <Header />
        <div className="w-100 min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ background: 'linear-gradient(180deg, #2D86FF 0%, #033AA7 100%)', paddingTop: '150px' }}>
          <div className="text-center">
            <h1 className="fs-1 text-white fw-bold mb-3">This Page Has Not Been Published</h1>
            <Link href="/" className="btn btn-outline-light px-4 py-2 fw-semibold fs-5">Return to Home Page</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  // Filter published sections
  const publishedSections = pageData?.section_list?.filter(section => isSectionPublished(section)) || [];

  return (
    <div lang="en">
      <Header />
      {publishedSections.length > 0 ? (
        publishedSections.map((section, index) => renderSection(section, index))
      ) : (
        <div className="min-vh-100 flex items-center justify-center pt-[300px]">
          <h1 className="fs-4 text-black fw-semibold">No Content Available</h1>
        </div>
      )}
      <Footer />
    </div>
  );
}
