import { notFound } from "next/navigation";
import {
  getBlogBySlug,
  getRecentBlogs,
  getAllCategories,
} from "@/hooks/getAllBlogs";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import BlogDetailSection from "@/components/Sections/Blog/BlogDetailSection";
import { urlFor } from '@/lib/sanity.realtime';

// Generate static params for all published blogs
import { client } from "@/lib/sanity";
export const dynamicParams = true;

export async function generateStaticParams() {
  // Directly fetch ONLY the slugs. No "getAllBlogs" helper needed.
  const posts = await client.fetch(
    `*[_type == "list_blog" && defined(slug.current) && !(_id in path("drafts.**"))]{
      "slug": slug.current
    }`,
  );

  return posts.map((post: any) => ({
    slug: post.slug.replace(/^\//, ""),
  }));
}

// Generate metadata for SEO (Indonesian version)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) return notFound();

  const metaTitle =
    post.seo?.metaTitle?.id ||
    post.seo?.metaTitle?.en ||
    post.title.id ||
    post.title.en;
  const metaDescription =
    post.seo?.metaDescription?.id ||
    post.seo?.metaDescription?.en ||
    post.excerpt.id ||
    post.excerpt.en;
  const keywords = post.seo?.keywords?.id || post.seo?.keywords?.en || [];

  return {
    title: `${metaTitle} | Sales Watch`,
    description: metaDescription,
    keywords: keywords.join(", "),
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: post.image?.asset ? [urlFor(post.image).url()] : [],
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: post.image?.asset ? [urlFor(post.image).url()] : [],
    },
  };
}

// Main page component (Indonesian route)
export default async function BlogPostID({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch all data needed for the detail page
  const post = await getBlogBySlug(slug);
  if (!post) return notFound();

  const [recentPosts, categories] = await Promise.all([
    getRecentBlogs(5, post._id),
    getAllCategories(),
  ]);

  return (
    <div className="min-h-screen bg-[#f2f7ff]">
      <Header />
      <BlogDetailSection
        slug={slug}
        initialPost={post}
        initialRecentPosts={recentPosts || []}
        initialCategories={categories || []}
      />
      <Footer />
    </div>
  );
}
