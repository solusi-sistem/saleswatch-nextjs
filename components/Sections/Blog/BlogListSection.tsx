'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSectionData } from '@/hooks/getSectionData';
import { BlogListSectionContent } from '@/types/section';
import { BlogItem } from '@/types/list/Blog';
import { usePathname } from 'next/navigation';
import { LangKey } from '@/types';
import { getAllBlogs } from '@/hooks/getAllBlogs';

interface BlogListSectionProps {
    id: string;
}

export default function BlogListSection({ id }: BlogListSectionProps) {
    const pathname = usePathname();
    const language: LangKey = pathname.startsWith('/id') ? 'id' : '';

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

                    // Jika tampilkan_semua = true, fetch semua blog dari Sanity
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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#061551] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!sectionData || !sectionData.list_blogs?.length) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-600">No blog posts available</p>
            </div>
        );
    }

    const blogs = showAll
        ? allBlogs
        : (sectionData.list_blogs?.filter(blog => blog.status === 'published') || []);

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

    return (
        <div className="min-h-screen bg-white flex flex-col pt-16">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="py-16 px-6 md:px-12 bg-gray-50">
                    <div className="container mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 animate__animated animate__fadeInUp">
                            {language === 'id' ? sectionData.title_section?.id : sectionData.title_section?.en || 'Latest Insights'}
                        </h1>
                        {sectionData.desc_section && (
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate__animated animate__fadeInUp">
                                {language === 'id' ? sectionData.desc_section.id : sectionData.desc_section.en}
                            </p>
                        )}
                    </div>
                </section>

                {/* Blog Grid Section */}
                <section className="py-15 px-6 md:px-12 md:pb-15 md:pt-0">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6 md:mb-8">
                            {currentPosts.map((post: BlogItem, index) => {
                                const slug = post.slug?.current;

                                const href =
                                    language === 'id'
                                        ? `/id/blog/${slug}`
                                        : `/blog/${slug}`;

                                return (
                                    <Link
                                        key={index}
                                        href={href}
                                        className="block group"
                                    >
                                        <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full animate__animated animate__fadeInUp">
                                            {post.image && (
                                                <div className="relative h-48">
                                                    <Image
                                                        src={post.image.asset.url}
                                                        alt={(language === 'id' ? post.image?.alt?.id : post.image?.alt?.id) || (language === 'id' ? post.title?.id : post.title?.id)}
                                                        fill
                                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-6">
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                    <span>{new Date(post.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</span>
                                                    <span>•</span>
                                                    <span>{post.author}</span>
                                                </div>

                                                {post.category && (
                                                    <span className="inline-block px-3 py-1 text-xs font-medium bg-[#061551] text-white rounded-full mb-3">
                                                        {language === 'id' ? post.category?.id : post.category?.id}
                                                    </span>
                                                )}

                                                <h2 className="text-xl font-bold mt-2 mb-3 line-clamp-2 group-hover:text-[#061551] transition">
                                                    {language === 'id' ? post.title?.id : post.title?.en}
                                                </h2>

                                                <p className="text-gray-700 mb-4 line-clamp-3">
                                                    {language === 'id' ? post.excerpt?.id : post.excerpt?.en}
                                                </p>

                                                <span className="text-[#061551] font-medium inline-flex items-center">
                                                    {language === 'id' ? 'Baca Selengkapnya' : 'Read More'} →
                                                </span>
                                            </div>
                                        </article>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Spacer untuk jaga jarak konsisten — hanya muncul jika TIDAK ada pagination */}
                        {totalPages <= 1 && (
                            <div className="h-3 md:h-0" aria-hidden="true"></div>
                        )}

                        {/* Pagination — hanya muncul jika diperlukan */}
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
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm transition ${currentPage === pageNum
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