'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { getBlogBySlug, getRecentBlogs, getAllCategories } from '@/hooks/getAllBlogs';
import { BlogItem, BlogCategory } from '@/types/list/Blog';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

const CACHE_KEY_POST = 'blog_detail_post_cache';
const CACHE_KEY_RECENT = 'blog_detail_recent_cache';
const CACHE_KEY_CATEGORIES = 'blog_detail_categories_cache';
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedPostData {
  data: BlogItem;
  slug: string;
  timestamp: number;
}

interface CachedRecentData {
  data: BlogItem[];
  timestamp: number;
}

interface CachedCategoriesData {
  data: BlogCategory[];
  timestamp: number;
}

interface BlogDetailSectionProps {
  slug: string;
}

type BlogLocale = 'en' | 'id';

const isValidLanguage = (lang: string): lang is BlogLocale => {
  return lang === 'en' || lang === 'id';
};

const customPortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?.url) return null;
      return (
        <div className="my-6">
          <Image
            src={value.asset.url}
            alt={value.alt || 'Blog image'}
            width={800}
            height={450}
            className="rounded-lg w-full"
          />
          {value.caption && (
            <p className="text-sm text-gray-500 text-center mt-2">{value.caption}</p>
          )}
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      const target = value?.href?.startsWith('http') ? '_blank' : undefined;
      return (
        <a
          href={value?.href || '#'}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-[#061551] hover:underline"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside my-4 space-y-2">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside my-4 space-y-2">{children}</ol>,
  },
};

export default function BlogDetailSection({ slug }: BlogDetailSectionProps) {
  const pathname = usePathname();
  const languageString = pathname.startsWith('/id') ? 'id' : 'en';
  const language: BlogLocale = isValidLanguage(languageString) ? languageString : 'en';

  const [post, setPost] = useState<BlogItem | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogItem[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCachedPost = (postSlug: string): BlogItem | null => {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY_POST}_${postSlug}`);
      if (!cached) return null;

      const parsedCache: CachedPostData = JSON.parse(cached);
      const now = Date.now();

      if (now - parsedCache.timestamp < CACHE_DURATION && parsedCache.slug === postSlug) {
        return parsedCache.data;
      } else {
        localStorage.removeItem(`${CACHE_KEY_POST}_${postSlug}`);
        return null;
      }
    } catch (error) {
      localStorage.removeItem(`${CACHE_KEY_POST}_${postSlug}`);
      return null;
    }
  };

  const setCachedPost = (data: BlogItem, postSlug: string) => {
    try {
      const cacheData: CachedPostData = {
        data,
        slug: postSlug,
        timestamp: Date.now(),
      };
      localStorage.setItem(`${CACHE_KEY_POST}_${postSlug}`, JSON.stringify(cacheData));
    } catch (error) {
    }
  };

  const getCachedRecent = (): BlogItem[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY_RECENT);
      if (!cached) return null;

      const parsedCache: CachedRecentData = JSON.parse(cached);
      const now = Date.now();

      if (now - parsedCache.timestamp < CACHE_DURATION) {
        return parsedCache.data;
      } else {
        localStorage.removeItem(CACHE_KEY_RECENT);
        return null;
      }
    } catch (error) {
      localStorage.removeItem(CACHE_KEY_RECENT);
      return null;
    }
  };

  const setCachedRecent = (data: BlogItem[]) => {
    try {
      const cacheData: CachedRecentData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY_RECENT, JSON.stringify(cacheData));
    } catch (error) {
    }
  };

  const getCachedCategories = (): BlogCategory[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY_CATEGORIES);
      if (!cached) return null;

      const parsedCache: CachedCategoriesData = JSON.parse(cached);
      const now = Date.now();

      if (now - parsedCache.timestamp < CACHE_DURATION) {
        return parsedCache.data;
      } else {
        localStorage.removeItem(CACHE_KEY_CATEGORIES);
        return null;
      }
    } catch (error) {
      localStorage.removeItem(CACHE_KEY_CATEGORIES);
      return null;
    }
  };

  const setCachedCategories = (data: BlogCategory[]) => {
    try {
      const cacheData: CachedCategoriesData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY_CATEGORIES, JSON.stringify(cacheData));
    } catch (error) {
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedPost = getCachedPost(slug);
        const cachedRecent = getCachedRecent();
        const cachedCategories = getCachedCategories();

        if (cachedPost) {
          setPost(cachedPost);
          setIsLoading(false);
        }

        if (cachedRecent) setRecentPosts(cachedRecent);
        if (cachedCategories) setCategories(cachedCategories);

        const postData = await getBlogBySlug(slug);
        if (postData) {
          setPost(postData);
          setCachedPost(postData, slug);

          const [recentData, categoriesData] = await Promise.all([
            getRecentBlogs(5, postData._id),
            getAllCategories(),
          ]);

          if (recentData) {
            setRecentPosts(recentData);
            setCachedRecent(recentData);
          }
          if (categoriesData) {
            setCategories(categoriesData);
            setCachedCategories(categoriesData);
          }
        }
      } catch (error) {
        const cachedPost = getCachedPost(slug);
        const cachedRecent = getCachedRecent();
        const cachedCategories = getCachedCategories();

        if (!post && cachedPost) setPost(cachedPost);
        if (recentPosts.length === 0 && cachedRecent) setRecentPosts(cachedRecent);
        if (categories.length === 0 && cachedCategories) setCategories(cachedCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    const interval = setInterval(async () => {
      try {
        const postData = await getBlogBySlug(slug);
        if (postData) {
          const currentDataString = JSON.stringify(post);
          const newDataString = JSON.stringify(postData);
          
          if (currentDataString !== newDataString) {
            setPost(postData);
            setCachedPost(postData, slug);
          }

          const [recentData, categoriesData] = await Promise.all([
            getRecentBlogs(5, postData._id),
            getAllCategories(),
          ]);

          if (recentData) {
            const currentRecentString = JSON.stringify(recentPosts);
            const newRecentString = JSON.stringify(recentData);
            
            if (currentRecentString !== newRecentString) {
              setRecentPosts(recentData);
              setCachedRecent(recentData);
            }
          }

          if (categoriesData) {
            const currentCategoriesString = JSON.stringify(categories);
            const newCategoriesString = JSON.stringify(categoriesData);
            
            if (currentCategoriesString !== newCategoriesString) {
              setCategories(categoriesData);
              setCachedCategories(categoriesData);
            }
          }
        }
      } catch (error) {
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [slug, post, recentPosts, categories]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f2f7ff] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link href={language === 'id' ? '/id/blog' : '/blog'} className="text-[#061551] hover:underline">
            {language === 'id' ? '← Kembali ke Blog' : '← Back to Blog'}
          </Link>
        </div>
      </div>
    );
  }

  const categoryUrl = post.category?.slug?.current
    ? language === 'id'
      ? `/id/blog/category/${post.category.slug.current}`
      : `/blog/category/${post.category.slug.current}`
    : '#';

  return (
    <div className="min-h-screen bg-[#f2f7ff] pt-16">
      <div className="pt-14 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {/* Featured Image */}
              {post.image?.asset?.url && (
                <div className="mb-8 rounded-lg overflow-hidden animate__animated animate__fadeInUp">
                  <Image
                    src={post.image.asset.url}
                    alt={
                      post.image.alt
                        ? language === 'id'
                          ? post.image.alt.id || post.image.alt.en
                          : post.image.alt.en || post.image.alt.id
                        : post.title[language]
                    }
                    width={800}
                    height={450}
                    className="w-full object-cover"
                    priority
                  />
                </div>
              )}

              {/* Meta: Category, Author & Date */}
              <div className="flex items-center gap-4 text-sm mb-6 animate__animated animate__fadeInUp flex-wrap">
                {/* Category Badge */}
                {post.category?.slug?.current && post.category?.name && (
                  <Link
                    href={categoryUrl}
                    className="px-3 py-1 text-xs font-medium bg-[#061551] text-white rounded-full hover:bg-[#0a1f6f] transition"
                  >
                    {language === 'id'
                      ? post.category.name.id || post.category.name.en
                      : post.category.name.en || post.category.name.id}
                  </Link>
                )}

                {post.author && (
                  <>
                    <span className="text-gray-500">
                      {language === 'id' ? 'Oleh' : 'By'} {post.author}
                    </span>
                    <span className="text-gray-500">•</span>
                  </>
                )}

                <time dateTime={post.date} className="text-gray-500">
                  {new Date(post.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6 animate__animated animate__fadeInUp">
                {post.title[language]}
              </h1>

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-10 animate__animated animate__fadeInUp">
                {post.content?.[language] && Array.isArray(post.content[language]) && (
                  <PortableText
                    value={post.content[language]}
                    components={customPortableTextComponents}
                  />
                )}
              </div>

              {/* Tags */}
              {/* {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-6 border-t">
                  <span className="font-semibold">Tags:</span>
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-white rounded-md shadow-sm px-3 py-1 text-sm hover:bg-gray-200 transition cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )} */}
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-8">
              {/* Categories */}
              {categories.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-bold text-lg mb-4 animate__animated animate__fadeInUp">
                    {language === 'id' ? 'Kategori' : 'Categories'}
                  </h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category._id}>
                        <Link
                          href={
                            language === 'id'
                              ? `/id/blog/category/${category.slug.current}`
                              : `/blog/category/${category.slug.current}`
                          }
                          className="hover:text-[#061551] transition block animate__animated animate__fadeInUp"
                        >
                          {language === 'id'
                            ? category.name.id || category.name.en
                            : category.name.en || category.name.id}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recent Posts */}
              {recentPosts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-bold text-lg mb-4 animate__animated animate__fadeInUp">
                    {language === 'id' ? 'Artikel Terbaru' : 'Recent Articles'}
                  </h3>
                  <div className="space-y-4">
                    {recentPosts.map((item) => (
                      <Link
                        key={item._id}
                        href={
                          language === 'id'
                            ? `/id/blog/${item.slug.current}`
                            : `/blog/${item.slug.current}`
                        }
                        className="flex gap-3 hover:opacity-75 transition animate__animated animate__fadeInUp"
                      >
                        {item.image?.asset?.url && (
                          <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image.asset.url}
                              alt={
                                item.image.alt
                                  ? language === 'id'
                                    ? item.image.alt.id || item.image.alt.en
                                    : item.image.alt.en || item.image.alt.id
                                  : item.title[language]
                              }
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-xs text-gray-500">
                            {new Date(item.date).toLocaleDateString(
                              language === 'id' ? 'id-ID' : 'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </div>
                          <div className="font-medium line-clamp-2">{item.title[language]}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags Cloud */}
              {post.tags && post.tags.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-bold text-lg mb-4 animate__animated animate__fadeInUp">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-white px-3 py-1 rounded-md shadow-sm text-sm border hover:border-[#061551] transition cursor-pointer animate__animated animate__fadeInUp"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}