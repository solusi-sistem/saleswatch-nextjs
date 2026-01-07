import { blogPosts } from '@/lib/blogData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

// Generate static paths
export async function generateStaticParams() {
    return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) notFound();

    return {
        title: `${post.title} | Sales Watch`,
        description: post.excerpt,
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) notFound();

    // Ambil 3 post terkait
    const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 3);

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="pt-30 pb-12">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Main Content */}
                        <div className="lg:w-2/3">
                            {/* Featured Image */}
                            <div className="mb-8 rounded-lg overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    width={800}
                                    height={450}
                                    className="w-full object-cover animate__animated animate__fadeInUp"
                                />
                            </div>

                            {/* Meta: Author & Date */}
                            <div className="text-sm text-gray-500 mb-6 animate__animated animate__fadeInUp">
                                By {post.author} • {post.date}
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-bold mb-6 animate__animated animate__fadeInUp">{post.title}</h1>

                            {/* Content */}
                            <div
                                className="prose prose-lg max-w-none mb-10 animate__animated animate__fadeInUp"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Tags */}
                            {/* <div className="flex flex-wrap gap-2">
                                <span className="font-semibold">Tags:</span>
                                <span className="bg-gray-100 px-3 py-1 rounded">Technology</span>
                                <span className="bg-gray-100 px-3 py-1 rounded">Business</span>
                            </div> */}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3 space-y-8">
                            {/* Categories */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-bold text-lg mb-4 animate__animated animate__fadeInUp">Categories</h3>
                                <ul className="space-y-2">
                                    <li><Link href="#" className="hover:text-blue-600 animate__animated animate__fadeInUp">Business</Link></li>
                                    <li><Link href="#" className="hover:text-blue-600 animate__animated animate__fadeInUp">Apps Development</Link></li>
                                    <li><Link href="#" className="hover:text-blue-600 animate__animated animate__fadeInUp">Social Marketing</Link></li>
                                </ul>
                            </div>

                            {/* Recent Posts */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-bold text-lg mb-4 animate__animated animate__fadeInUp">Recent Posts</h3>
                                <div className="space-y-4">
                                    {relatedPosts.map((item) => (
                                        <Link key={item.id} href={`/blog/${item.slug}`} className="flex gap-3 hover:opacity-75 animate__animated animate__fadeInUp">
                                            {/* ✅ Gunakan Image dengan src dari item.image */}
                                            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">{item.date}</div>
                                                <div className="font-medium line-clamp-2">{item.title}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            {/* Tags */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-bold text-lg mb-4 animate__animated animate__fadeInUp">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Security', 'Business', 'Digital',].map((tag) => (
                                        <span key={tag} className="bg-white px-3 py-1 rounded text-sm border animate__animated animate__fadeInUp">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}