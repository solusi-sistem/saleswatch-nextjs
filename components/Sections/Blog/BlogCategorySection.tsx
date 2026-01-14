'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getBlogsByCategory, getCategoryBySlug } from '@/hooks/getAllBlogs';
import { BlogItem, BlogCategory } from '@/types/list/Blog';

interface BlogCategorySectionProps {
  categorySlug: string;
}

// Tipe lokal untuk BlogCategorySection component
type BlogLocale = 'en' | 'id';

export default function BlogCategorySection({ categorySlug }: BlogCategorySectionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const language: BlogLocale = pathname.startsWith('/id') ? 'id' : 'en';

  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch category and posts
        const [categoryData, postsData] = await Promise.all([getCategoryBySlug(categorySlug), getBlogsByCategory(categorySlug, 'published')]);

        if (categoryData) setCategory(categoryData);
        if (postsData) setPosts(postsData);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

  const handlePostClick = (slug: string) => {
    const href = language === 'id' ? `/id/blog/${slug}` : `/blog/${slug}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    router.push(href);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f2f7ff] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#061551] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#f2f7ff] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{language === 'id' ? 'Kategori tidak ditemukan' : 'Category not found'}</h1>
          <Link href={language === 'id' ? '/id/blog' : '/blog'} className="text-[#061551] hover:underline">
            {language === 'id' ? '← Kembali ke Blog' : '← Back to Blog'}
          </Link>
        </div>
      </div>
    );
  }

  const categoryName = language === 'id' ? category.name.id || category.name.en : category.name.en || category.name.id;

  const categoryDescription = category.description ? (language === 'id' ? category.description.id || category.description.en : category.description.en || category.description.id) : '';

  return (
    <div className="min-h-screen bg-[#f2f7ff] pt-16">
      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-16 pb-8">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Back Button */}
          <div className="mb-6">
            <Link href={language === 'id' ? '/id/blog' : '/blog'} className="text-[#061551] hover:text-[#0a1f6f] inline-flex items-center gap-2 text-sm font-medium transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {language === 'id' ? 'Kembali ke Semua Blog' : 'Back to All Blogs'}
            </Link>
          </div>

          {/* Category Description */}
          {categoryDescription && <p className="text-xl text-gray-600 max-w-3xl mx-auto animate__animated animate__fadeInUp">{categoryDescription}</p>}
        </div>
      </section>

      {/* Blog Posts Section */}
      <div className="py-0 px-6 md:px-12 md:pb-15 bg-[#f2f7ff]">
        <div className="container mx-auto">
          {/* Posts Count */}
          {posts.length > 0 && (
            <div className="mb-6 md:mb-8">
              <p className="text-gray-600 text-sm">
                {language === 'id' ? 'Menampilkan' : 'Showing'} {posts.length} {language === 'id' ? 'artikel dalam kategori' : 'articles in category'} <span className="font-semibold">{categoryName}</span>
              </p>
            </div>
          )}

          {/* Blog Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {posts.map((post) => {
                const slug = post.slug?.current || '';

                // Safe extraction with null checks
                const postTitle = post.title ? (language === 'id' ? post.title.id || post.title.en : post.title.en || post.title.id) : 'Untitled';

                const postExcerpt = post.excerpt ? (language === 'id' ? post.excerpt.id || post.excerpt.en : post.excerpt.en || post.excerpt.id) : '';

                const imageAlt = post.image?.alt ? (language === 'id' ? post.image.alt.id || post.image.alt.en : post.image.alt.en || post.image.alt.id) : postTitle;

                return (
                  <div key={post._id} className="block group cursor-pointer" onClick={() => handlePostClick(slug)}>
                    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full animate__animated animate__fadeInUp">
                      {/* Image */}
                      {post.image?.asset?.url && (
                        <div className="relative h-60 xl:h-92">
                          <Image src={post.image.asset.url} alt={imageAlt} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                      )}

                      <div className="p-6">
                        {/* Meta Information */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                          {post.author && (
                            <>
                              <span>•</span>
                              <span>{post.author}</span>
                            </>
                          )}
                        </div>

                        {/* Category Badge */}
                        <div className="inline-block px-3 py-1 text-xs font-medium bg-[#061551] text-white rounded-full mb-3">{categoryName}</div>

                        {/* Title */}
                        <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-[#061551] transition">{postTitle}</h2>

                        {/* Excerpt */}
                        {postExcerpt && <p className="text-gray-700 mb-4 line-clamp-3">{postExcerpt}</p>}

                        {/* Read More Link */}
                        <span className="text-[#061551] font-medium inline-flex items-center">{language === 'id' ? 'Baca Selengkapnya' : 'Read More'} →</span>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">{language === 'id' ? 'Belum Ada Artikel' : 'No Articles Yet'}</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {language === 'id' ? 'Belum ada artikel yang dipublikasikan dalam kategori' : 'No articles published in category'} <span className="font-semibold">{categoryName}</span>
              </p>
              <Link href={language === 'id' ? '/id/blog' : '/blog'} className="inline-block px-6 py-3 bg-[#061551] text-white rounded-lg hover:bg-[#0a1f6f] transition font-medium">
                {language === 'id' ? 'Lihat Semua Artikel' : 'View All Articles'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
