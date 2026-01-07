import { blogPosts } from '@/lib/blogData';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export const metadata = {
    title: 'Blog | Sales Watch',
    description: 'Insights on field sales management, fraud prevention, and productivity optimization.',
};

const POSTS_PER_PAGE = 6;

// 🔑 JADIKAN ASYNC dan AWAIT searchParams
export default async function BlogPage({
    searchParams
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // 🔑 AWAIT searchParams
    const sp = await searchParams;

    // Ambil nilai page, pastikan integer ≥ 1
    const page = sp?.page ? parseInt(Array.isArray(sp.page) ? sp.page[0] : sp.page) : 1;
    const currentPage = isNaN(page) || page < 1 ? 1 : page;

    const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const currentPosts = blogPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    // Pagination helper
    const getPageRange = () => {
        const delta = 2;
        const range = [];
        for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
            range.push(i);
        }
        return range;
    };

    return (
        <div className="min-h-screen bg-white flex flex-col pt-16">
            <Header />

            <main className="flex-grow">
                <section className="py-16 px-6 md:px-12 bg-gray-50">
                    <div className="container mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 animate__animated animate__fadeInUp">Latest Insights</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto animate__animated animate__fadeInUp">
                            Get deep insights on field sales management, productivity strategies, and innovative solutions for field challenges.
                        </p>
                    </div>
                </section>

                <section className="py-15 px-6 md:px-12 md:pb-15 md:pt-0">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6 md:mb-8">
                            {currentPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="block group"
                                >
                                    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full animate__animated animate__fadeInUp ">
                                        <div className="relative h-48">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="p-6">
                                            <span className="text-sm text-gray-500">
                                                {post.date} • {post.author}
                                            </span>

                                            <h2 className="text-xl font-bold mt-2 mb-3 line-clamp-2 group-hover:text-[#061551] transition">
                                                {post.title}
                                            </h2>

                                            <p className="text-gray-700 mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>

                                            <span className="text-[#061551] font-medium inline-flex items-center">
                                                Read More →
                                            </span>
                                        </div>
                                    </article>
                                </Link>
                            ))}

                        </div>

                        {/* Spacer untuk jaga jarak konsisten — hanya muncul jika TIDAK ada pagination */}
                        {totalPages <= 1 && (
                            <div className="h-3 md:h-0" aria-hidden="true"></div>
                        )}

                        {/* Pagination — hanya muncul jika diperlukan */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center flex-wrap gap-2">
                                {currentPage > 1 && (
                                    <Link
                                        href={`/blog?page=${currentPage - 1}`}
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm"
                                    >
                                        Previous
                                    </Link>
                                )}

                                {getPageRange().map((pageNum) => (
                                    <Link
                                        key={pageNum}
                                        href={`/blog?page=${pageNum}`}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm transition ${currentPage === pageNum
                                            ? 'bg-[#061551] text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </Link>
                                ))}

                                {currentPage < totalPages && (
                                    <Link
                                        href={`/blog?page=${currentPage + 1}`}
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}