import { notFound } from 'next/navigation';
import { getCategoryBySlug, getAllCategories } from '@/hooks/getAllBlogs';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import BlogCategorySection from '@/components/Sections/Blog/BlogCategorySection';

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) return notFound();

  const language = 'en';
  const categoryName = category.name[language] || category.name.id;
  const metaTitle = `${categoryName} | Sales Watch Blog`;
  const metaDescription = 
    category.description?.[language] || 
    category.description?.id || 
    `Articles about ${categoryName}`;

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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const category = await getCategoryBySlug(slug);
  if (!category) return notFound();

  return (
    <div className="min-h-screen bg-[#f2f7ff]">
      <Header />
      <BlogCategorySection categorySlug={slug} />
      <Footer />
    </div>
  );
}
