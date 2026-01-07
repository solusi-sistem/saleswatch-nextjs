import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

// Import semua komponen section
import HeroUtama from "@/components/Sections/Hero/HeroUtama";
import HeroUmum from "@/components/Sections/Hero/HeroUmum";
import SupportHeader from "@/components/Sections/Support/SupportHeader";
import WhyItWorks from "@/components/Sections/About/WhyItWorks";
import StoryVisionMission from "@/components/Sections/About/StoryVisionMission";
import Testimonial from "@/components/Sections/Testimonial/Testimonial";
import Faq from "@/components/Sections/Faq/Faq";
import Blog from "@/components/Sections/Blog/Blog";
// import RequestDemo from "@/components/Sections/Demo/RequestDemo";
// import Features from "@/components/Sections/Features/Features";
// import Pricing from "@/components/Sections/Pricing/Pricing";
// import SupportSection from "@/components/Sections/Support/SupportSection";
// import PrivacyPolicySection from "@/components/Sections/Legal/PrivacyPolicySection";
// import TermsAndConditionsSection from "@/components/Sections/Legal/TermsAndConditionsSection";
import FaqSection from "@/components/Sections/Faq/FaqSection";
import BlogListSection from "@/components/Sections/Blog/BlogListSection";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { JSX } from "react";
import { client } from "@/lib/sanity";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Type definitions
interface SeoTitle {
    seo_title_en?: string;
    seo_title_id?: string;
}

interface SeoDescription {
    seo_description_en?: string;
    seo_description_id?: string;
}

interface SeoKeyword {
    seo_keyword_en?: string;
    seo_keyword_id?: string;
}

interface SeoIcon {
    secure_url?: string;
    url?: string;
}

interface Section {
    _id: string;
    _type: string;
    name_section?: string;
    type_section: string;
    published_at?: string | boolean;
}

interface PageData {
    _id: string;
    _type: string;
    name_page?: string;
    slug_page?: {
        current: string;
    };
    published_at?: string | boolean;
    seo_title?: SeoTitle;
    seo_description?: SeoDescription;
    seo_keyword?: SeoKeyword;
    seo_icon?: SeoIcon;
    section_list?: Section[];
}

interface PageProps {
    params: Promise<{
        slug?: string[];
    }>;
}

// Fungsi untuk fetch data page berdasarkan slug
async function getPageData(slug: string): Promise<PageData | null> {
    const current_slug = `${slug}`;
    const query = groq`*[_type == "page" && slug_page.current == $current_slug][0]{
        _id,
        _type,
        name_page,
        slug_page,
        published_at,

        seo_title {
            seo_title_en,
            seo_title_id
        },
        seo_description {
            seo_description_en,
            seo_description_id
        },
        seo_keyword {
            seo_keyword_en,
            seo_keyword_id
        },
        seo_icon,
        
        section_list[]->{
            _id,
            _type,
            name_section,
            type_section,
            published_at
        }
    }`;

    try {
        const result = await client.fetch(query, { current_slug }, { cache: "no-store" });
        console.log("result slug " + current_slug, result);
        return result || null;
    } catch (error) {
        console.error("Error fetching page data:", error);
        return null;
    }
}

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

// Fungsi untuk check apakah page sudah published
function isPagePublished(pageData: PageData | null): boolean {
    if (!pageData) return false;

    // Jika published_at adalah boolean
    if (typeof pageData.published_at === 'boolean') {
        return pageData.published_at;
    }

    // Jika published_at adalah string (tanggal)
    if (typeof pageData.published_at === 'string') {
        const publishDate = new Date(pageData.published_at);
        const now = new Date();
        return publishDate <= now;
    }

    return false;
}

// Fungsi untuk check apakah section sudah published
function isSectionPublished(section: Section): boolean {
    // Jika published_at adalah boolean
    if (typeof section.published_at === 'boolean') {
        return section.published_at;
    }

    // Jika published_at adalah string (tanggal)
    if (typeof section.published_at === 'string') {
        const publishDate = new Date(section.published_at);
        const now = new Date();
        return publishDate <= now;
    }

    return false;
}

// Komponen untuk render section
function renderSection(section: Section, index: number): JSX.Element | null {
    if (!isSectionPublished(section)) {
        return null;
    }

    const sectionProps = { id: section._id, key: index };

    switch (section.type_section) {
        case 'heroUtama':
            return <HeroUtama {...sectionProps} />;
        case 'heroUmum':
            return <HeroUmum {...sectionProps} />;
        case 'supportHeader':
            return <SupportHeader {...sectionProps} />;
        case 'whyItWorks':
            return <WhyItWorks {...sectionProps} />;
        case 'storyVisionMission':
            return <StoryVisionMission {...sectionProps} />;
        case 'testimonial':
            return <Testimonial {...sectionProps} />;
        case 'faq':
            return <Faq {...sectionProps} />;
        case 'blog':
            return <Blog {...sectionProps} />;
        // case 'requestDemo':
        //     return <RequestDemo {...sectionProps} />;
        // case 'features':
        //     return <Features {...sectionProps} />;
        // case 'pricing':
        //     return <Pricing {...sectionProps} />;
        // case 'supportSection':
        //     return <SupportSection {...sectionProps} />;
        // case 'privacyPolicySection':
        //     return <PrivacyPolicySection {...sectionProps} />;
        // case 'termsAndConditionsSection':
        //     return <TermsAndConditionsSection {...sectionProps} />;
        case 'faqSection':
            return <FaqSection {...sectionProps} />;
        case 'blogListSection':
            return <BlogListSection {...sectionProps} />;
        default:
            console.warn(`Unknown section type: ${section.type_section}`);
            return null;
    }
}

// Main Page Component (Server Component)
export default async function Page({ params }: PageProps) {
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

    return (
        <>
            <Header />
            {publishedSections.length > 0 ? (
                publishedSections.map((section, index) =>
                    renderSection(section, index)
                )
            ) : (
                <div
                    className="w-100 min-vh-100 d-flex flex-column justify-content-center align-items-center position-relative"
                    style={{
                        background: "linear-gradient(180deg, #2D86FF 0%, #033AA7 100%)",
                        paddingTop: "300px",
                        paddingBottom: "200px",
                        transition: "all 1s ease-in-out"
                    }}
                >
                    <h1 className="fs-4 text-white fw-semibold">
                        No Sections Available
                    </h1>
                </div>
            )}
            <Footer />
        </>
    );
}