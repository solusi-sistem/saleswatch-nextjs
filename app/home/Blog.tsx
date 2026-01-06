import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from '@/lib/blogData';

export default function BlogSection() {
    // Ambil 3 blog posts terbaru
    const latestBlogs = blogPosts.slice(0, 3);

    return (
        <section className="bg-white py-16 md:py-20">
            <div className="container mx-auto px-6 sm:px-6 lg:px-12 xl:px-24">

                {/* Header */}
                <div className="mb-12 flex flex-col items-center text-center gap-4">
                    <div className="p-[2px] rounded-full bg-gradient-to-r from-[#061551] to-[#10b981]">
                        <div className="bg-white rounded-full px-5 py-1">
                            <span className="text-sm md:text-base text-[#061551] uppercase tracking-wide">
                                Blog & Articles
                            </span>
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Read Latest Story
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                    {latestBlogs.map((blog, index) => (
                        <article
                            key={blog.id}
                            className="
                group w-full overflow-hidden rounded-2xl border border-gray-200 bg-white
                shadow-lg shadow-md sm:shadow-sm transition hover:shadow-xl " >
                            {/* Thumbnail */}
                            <Link
                                href={`/blog/${blog.slug}`}
                                className="relative block aspect-[4/3] overflow-hidden"
                            >
                                <Image
                                    src={blog.image}
                                    alt={blog.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white transition group-hover:bg-[#061551]">
                                    {blog.category}
                                </span>
                            </Link>

                            {/* Content */}
                            <div className="p-5 sm:p-6">
                                <div className="mb-3 flex items-center gap-4 text-xs text-gray-600">
                                    <span className="hover:text-[#061551] transition">
                                        {blog.author}
                                    </span>
                                    <span className="hover:text-[#061551] transition">
                                        {blog.date}
                                    </span>
                                </div>

                                <h3 className="mb-4 text-lg font-semibold text-gray-900 leading-snug transition group-hover:text-[#061551]">
                                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                                </h3>

                                <Link
                                    href={`/blog/${blog.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-black underline underline-offset-4 decoration-black transition hover:text-[#061551] hover:decoration-[#061551]"
                                >
                                    Learn More
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}