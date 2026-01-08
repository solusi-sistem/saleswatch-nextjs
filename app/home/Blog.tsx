'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/blogData';

export default function BlogSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLElement>(null);
  const card2Ref = useRef<HTMLElement>(null);
  const card3Ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (headerRef.current) observer.observe(headerRef.current);
    if (card1Ref.current) observer.observe(card1Ref.current);
    if (card2Ref.current) observer.observe(card2Ref.current);
    if (card3Ref.current) observer.observe(card3Ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Ambil 3 blog posts terbaru
  const latestBlogs = blogPosts.slice(0, 3);
  const cardRefs = [card1Ref, card2Ref, card3Ref];

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="container mx-auto px-6 sm:px-6 lg:px-12 xl:px-24">
        <div 
          ref={headerRef}
          className="mb-12 flex flex-col items-center text-center gap-4 opacity-0"
          style={{ animationDelay: '0s', animationFillMode: 'both' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Read Latest Story</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {latestBlogs.map((blog, index) => (
            <article
              key={blog.id}
              ref={cardRefs[index]}
              className="
                group w-full overflow-hidden rounded-2xl border border-gray-200 bg-white
                shadow-lg shadow-md sm:shadow-sm transition hover:shadow-xl opacity-0"
              style={{ 
                animationDelay: `${0.1 + (index * 0.15)}s`,
                animationFillMode: 'both'
              }}
            >

              <Link href={`/blog/${blog.slug}`} className="relative block aspect-[4/3] overflow-hidden">
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

              <div className="p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-4 text-xs text-gray-600">
                  <span className="hover:text-[#061551] transition">{blog.author}</span>
                  <span className="hover:text-[#061551] transition">{blog.date}</span>
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