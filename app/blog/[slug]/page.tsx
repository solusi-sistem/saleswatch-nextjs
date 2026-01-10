import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogBySlug, getRecentBlogs, getBlogCategories, getAllBlogs } from '@/hooks/getAllBlogs';
import { PortableText } from '@portabletext/react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { BlogItem } from '@/types/list/Blog';

// Custom Portable Text components
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
                    className="text-blue-600 hover:underline"
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
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }: any) => <ul className="list-disc list-inside my-4 space-y-2">{children}</ul>,
        number: ({ children }: any) => <ol className="list-decimal list-inside my-4 space-y-2">{children}</ol>,
    },
};

// Generate static paths untuk semua blog posts
export async function generateStaticParams() {
    const blogs = await getAllBlogs('published');

    if (!blogs) return [];

    return blogs.map((post) => ({
        slug: post.slug.current,
    }));
}

// Generate metadata untuk SEO
export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const post = await getBlogBySlug(slug);

    if (!post) return notFound();

    // Gunakan SEO metadata jika tersedia, fallback ke data default
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

export default async function BlogPost({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    // Fetch blog post berdasarkan slug
    const post: BlogItem | null = await getBlogBySlug(slug);

    if (!post) return notFound();

    // Ambil 5 blog terbaru (exclude current post)
    const recentPosts = await getAllBlogs('published');

    // Ambil semua kategori untuk sidebar
    const categories = await getBlogCategories();
    console.log("Categories:", categories);

    // Language setting (default 'id' sesuai permintaan)
    const language = 'id';

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="pt-30 pb-12">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Main Content */}
                        <div className="lg:w-2/3">

                            {/* Featured Image */}
                            {post.image && (
                                <div className="mb-8 rounded-lg overflow-hidden animate__animated animate__fadeInUp">
                                    <Image
                                        src={post.image.asset.url}
                                        alt={post.image.alt?.[language] || post.title[language]}
                                        width={800}
                                        height={450}
                                        className="w-full object-cover"
                                        priority
                                    />
                                </div>
                            )}

                            {/* Meta: Author & Date */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 animate__animated animate__fadeInUp">
                                <span>Oleh {post.author}</span>
                                <span>•</span>
                                <time dateTime={post.date}>
                                    {new Date(post.date).toLocaleDateString('id-ID', {
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

                            {/* Content using PortableText */}
                            <div className="prose prose-lg max-w-none mb-10 animate__animated animate__fadeInUp">
                                {post.content?.[language] && (
                                    <PortableText
                                        value={post.content[language]}
                                        components={customPortableTextComponents}
                                    />
                                )}
                            </div>

                            {/* Tags dari field tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-6 border-t">
                                    <span className="font-semibold">Tags:</span>
                                    {post.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-100 px-3 py-1 rounded text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3 space-y-8">
                            {/* Categories */}
                            {recentPosts && recentPosts.length > 0 && (
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="font-bold text-lg mb-4 animate__animated animate__fadeInUp">
                                        Kategori
                                    </h3>
                                    <ul className="space-y-2">
                                        {recentPosts.map((data, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={`/id/blog?category=${data?.category?.id}` || ''}
                                                    className="hover:text-blue-600 transition animate__animated animate__fadeInUp"
                                                >
                                                    {data?.category?.id}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Recent Posts / Related Posts */}
                            {recentPosts && recentPosts.length > 0 && (
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="font-bold text-lg mb-4 animate__animated animate__fadeInUp">
                                        Artikel Terbaru
                                    </h3>
                                    <div className="space-y-4">
                                        {recentPosts
                                            .slice(0, 5)
                                            .map((item) => (
                                                <Link
                                                    key={item._id}
                                                    href={`/blog/${item.slug.current}`}
                                                    className="flex gap-3 hover:opacity-75 transition animate__animated animate__fadeInUp"
                                                >
                                                    {item.image && (
                                                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={item.image.asset.url}
                                                                alt={item.image.alt?.[language] || item.title[language]}
                                                                width={64}
                                                                height={64}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(item.date).toLocaleDateString('id-ID', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="font-medium line-clamp-2">
                                                            {item.title[language]}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Tags Cloud dari SEO Keywords */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="font-bold text-lg mb-4 animate__animated animate__fadeInUp">
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-white px-3 py-1 rounded text-sm border hover:border-[#061551] transition cursor-pointer animate__animated animate__fadeInUp"
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

            <Footer />
        </div>
    );
}