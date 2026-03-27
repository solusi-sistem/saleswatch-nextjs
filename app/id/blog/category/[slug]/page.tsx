import { notFound } from 'next/navigation';
import { getCategoryBySlug, getBlogsByCategory } from '@/hooks/getAllBlogs';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import BlogCategorySection from '@/components/Sections/Blog/BlogCategorySection';

// Generate static params for all active categories
import { client } from '@/lib/sanity';
export const dynamicParams = true;


export async function generateStaticParams() {
  const categories = await client.fetch(
    `*[_type == "list_blog_category" && defined(slug.current) && !(_id in path("drafts.**"))]{ 
      "slug": slug.current 
    }`
  );

  return categories.map((cat: any) => ({
    slug: cat.slug.replace(/^\//, ''),
  }));
}

// Generate metadata for SEO (Indonesian version)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) return notFound();

  const language = 'id'; // Indonesian for /id/blog route
  const categoryName = category.name[language] || category.name.en;
  const metaTitle = `${categoryName} | Sales Watch Blog`;
  const metaDescription = 
    category.description?.[language] || 
    category.description?.en || 
    `Artikel tentang ${categoryName}`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
    },
  };
}

// Main page component (Indonesian route)
export default async function CategoryPageID({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Verify category exists on server side
  const category = await getCategoryBySlug(slug);
  if (!category) return notFound();

  const posts = await getBlogsByCategory(slug, 'published');

  return (
    <div className="min-h-screen bg-[#f2f7ff]">
      <Header />
      <BlogCategorySection 
        categorySlug={slug} 
        initialCategory={category}
        initialPosts={posts || []}
      />
      <Footer />
    </div>
  );
}
