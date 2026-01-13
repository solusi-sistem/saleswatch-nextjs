'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getSectionData } from '@/hooks/getSectionData';
import { BlogListSectionContent } from '@/types/section';
import { BlogItem } from '@/types/list/Blog';
import { usePathname } from 'next/navigation';
import { getAllBlogs } from '@/hooks/getAllBlogs';

interface BlogListSectionProps {
  id: string;
}

// Type definition for language
type BlogLocale = 'en' | 'id';

const isValidLanguage = (lang: string): lang is BlogLocale => {
  return lang === 'en' || lang === 'id';
};

export default function BlogListSection({ id }: BlogListSectionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const languageString = pathname.startsWith('/id') ? 'id' : 'en';
  const language: BlogLocale = isValidLanguage(languageString) ? languageString : 'en';

  const [sectionData, setSectionData] = useState<BlogListSectionContent | null>(null);
  const [allBlogs, setAllBlogs] = useState<BlogItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getSectionData(id);
        if (data?.blog_list_section_content) {
          setSectionData(data.blog_list_section_content);
          const tampilkanSemua = data.blog_list_section_content.tampilkan_semua || false;
          setShowAll(tampilkanSemua);

          if (tampilkanSemua) {
            const blogs = await getAllBlogs('published', undefined, 'dateDesc');
            if (blogs) {
              setAllBlogs(blogs);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching blog list section:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  if (!sectionData || (!showAll && !sectionData.list_blogs?.length)) {
    return (
      <div className="min-h-screen bg-[#f2f7ff] flex items-center justify-center">
        <p className="text-gray-600">No blog posts available</p>
      </div>
    );
  }

  const blogs = showAll ? allBlogs : sectionData.list_blogs?.filter((blog) => blog.status === 'published') || [];

  const POSTS_PER_PAGE = sectionData?.post_per_page || 6;
  const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = blogs.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const getPageRange = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      range.push(i);
    }
    return range;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (e: React.MouseEvent, categorySlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    const categoryUrl = language === 'id' ? `/id/blog/category/${categorySlug}` : `/blog/category/${categorySlug}`;
    router.push(categoryUrl);
  };

  const handlePostClick = (slug: string) => {
    const href = language === 'id' ? `/id/blog/${slug}` : `/blog/${slug}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-[#f2f7ff] flex flex-col pt-16">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 px-6 md:px-12 bg-[#f2f7ff]">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate__animated animate__fadeInUp">
              {sectionData.title_section 
                ? (language === 'id' ? sectionData.title_section.id : sectionData.title_section.en) 
                : ''}
            </h1>
            {sectionData.desc_section && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto animate__animated animate__fadeInUp">
                {language === 'id' ? sectionData.desc_section.id : sectionData.desc_section.en}
              </p>
            )}
          </div>
        </section>

        {/* Blog Grid Section */}
        <section className="py-0 px-6 md:px-12 md:pb-15 md:pt-0">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6 md:mb-8">
              {currentPosts.map((post: BlogItem, index) => {
                const slug = post.slug?.current || '';
                
                // Safe extraction with null checks for category
                const categoryName = post.category?.name
                  ? (language === 'id' ? (post.category.name.id || post.category.name.en) : (post.category.name.en || post.category.name.id))
                  : '';
                const categorySlug = post.category?.slug?.current || '';

                // Safe extraction with null checks for title
                const postTitle = post.title
                  ? (language === 'id' ? (post.title.id || post.title.en) : (post.title.en || post.title.id))
                  : 'Untitled';

                // Safe extraction with null checks for excerpt
                const postExcerpt = post.excerpt
                  ? (language === 'id' ? (post.excerpt.id || post.excerpt.en) : (post.excerpt.en || post.excerpt.id))
                  : '';

                // Safe extraction for image alt with proper null checks
                const imageAlt = post.image?.alt
                  ? (language === 'id' ? (post.image.alt.id || post.image.alt.en) : (post.image.alt.en || post.image.alt.id)) || postTitle
                  : postTitle;

                return (
                  <div
                    key={`blog-${slug}-${index}`}
                    className="block group cursor-pointer"
                    onClick={() => handlePostClick(slug)}
                  >
                    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full animate__animated animate__fadeInUp">
                      {post.image?.asset?.url && (
                        <div className="relative h-48">
                          <Image
                            src={post.image.asset.url}
                            alt={imageAlt}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <span>
                            {new Date(post.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                          <span>•</span>
                          <span>{post.author || 'Unknown'}</span>
                        </div>

                        {/* Category badge */}
                        {categoryName && categorySlug && (
                          <button
                            onClick={(e) => handleCategoryClick(e, categorySlug)}
                            className="inline-block px-3 py-1 text-xs font-medium bg-[#061551] text-white rounded-full mb-3 hover:bg-[#0a1f6f] transition"
                          >
                            {categoryName}
                          </button>
                        )}

                        <h2 className="text-xl font-bold mt-2 mb-3 line-clamp-2 group-hover:text-[#061551] transition">
                          {postTitle}
                        </h2>

                        {postExcerpt && (
                          <p className="text-gray-700 mb-4 line-clamp-3">
                            {postExcerpt}
                          </p>
                        )}

                        <span className="text-[#061551] font-medium inline-flex items-center">
                          {language === 'id' ? 'Baca Selengkapnya' : 'Read More'} →
                        </span>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>

            {totalPages <= 1 && <div className="h-3 md:h-0" aria-hidden="true"></div>}

            {totalPages > 1 && (
              <div className="flex justify-center items-center flex-wrap gap-2">
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm"
                  >
                    {language === 'id' ? 'Sebelumnya' : 'Previous'}
                  </button>
                )}

                {getPageRange().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm transition ${
                      currentPage === pageNum
                        ? 'bg-[#061551] text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm"
                  >
                    {language === 'id' ? 'Selanjutnya' : 'Next'}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}