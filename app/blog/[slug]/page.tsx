import { notFound } from 'next/navigation';
import { getBlogBySlug, getAllBlogs } from '@/hooks/getAllBlogs';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import BlogDetailSection from '@/components/Sections/Blog/BlogDetailSection';

// Generate static params for all published blogs
export async function generateStaticParams() {
  const blogs = await getAllBlogs('published');
  if (!blogs) return [];
  
  return blogs.map((post) => ({
    slug: post.slug.current,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) return notFound();

  const metaTitle = post.seo?.metaTitle?.id || post.title.id;
  const metaDescription = post.seo?.metaDescription?.id || post.excerpt.id;
  const keywords = post.seo?.keywords?.id || [];

  return {
    title: `${metaTitle} | Sales Watch`,
    description: metaDescription,
    keywords: keywords.join(', '),
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: post.image?.asset?.url ? [post.image.asset.url] : [],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: post.image?.asset?.url ? [post.image.asset.url] : [],
    },
  };
}

// Main page component
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Optional: Verify blog exists on server side
  const post = await getBlogBySlug(slug);
  if (!post) return notFound();

  return (
    <>
      <Header />
      <BlogDetailSection slug={slug} />
      <Footer />
    </>
  );
}