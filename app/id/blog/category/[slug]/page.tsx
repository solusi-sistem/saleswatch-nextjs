import { notFound } from 'next/navigation';
import { getCategoryBySlug, getAllCategories } from '@/hooks/getAllBlogs';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import BlogCategorySection from '@/components/Sections/Blog/BlogCategorySection';

// Generate static params for all active categories
export async function generateStaticParams() {
  const categories = await getAllCategories();
  if (!categories) return [];
  
  return categories.map((category) => ({
    slug: category.slug.current,
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

  return (
    <div className="min-h-screen bg-[#f2f7ff]">
      <Header />
      <BlogCategorySection categorySlug={slug} />
      <Footer />
    </div>
  );
}