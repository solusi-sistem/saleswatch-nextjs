import Image from 'next/image';
import Link from 'next/link';
import { PortableTextComponents } from '@portabletext/react';

/**
 * Custom components untuk render Portable Text dari Sanity
 * Digunakan untuk styling konten blog yang berasal dari Sanity CMS
 */
export const portableTextComponents: PortableTextComponents = {
    types: {
        image: ({ value }: any) => {
            if (!value?.asset?.url) return null;

            return (
                <div className="my-8">
                    <Image
                        src={value.asset.url}
                        alt={value.alt || 'Blog image'}
                        width={800}
                        height={450}
                        className="rounded-lg w-full object-cover"
                    />
                    {value.caption && (
                        <p className="text-sm text-gray-500 text-center mt-2 italic">
                            {value.caption}
                        </p>
                    )}
                </div>
            );
        },
    },

    marks: {
        link: ({ children, value }: any) => {
            const href = value?.href || '#';
            const isExternal = href.startsWith('http');
            const target = isExternal ? '_blank' : undefined;
            const rel = isExternal ? 'noopener noreferrer' : undefined;

            return (
                <a
                    href={href}
                    target={target}
                    rel={rel}
                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                >
                    {children}
                </a>
            );
        },
        strong: ({ children }: any) => (
            <strong className="font-bold">{children}</strong>
        ),
        em: ({ children }: any) => (
            <em className="italic">{children}</em>
        ),
        code: ({ children }: any) => (
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600">
                {children}
            </code>
        ),
    },

    block: {
        normal: ({ children }: any) => (
            <p className="mb-4 leading-relaxed text-gray-800">{children}</p>
        ),
        h2: ({ children }: any) => (
            <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900">
                {children}
            </h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-900">
                {children}
            </h3>
        ),
        h4: ({ children }: any) => (
            <h4 className="text-xl font-bold mt-6 mb-2 text-gray-900">
                {children}
            </h4>
        ),
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-[#061551] bg-gray-50 pl-6 pr-4 py-4 my-6 italic text-gray-700">
                {children}
            </blockquote>
        ),
    },

    list: {
        bullet: ({ children }: any) => (
            <ul className="list-disc list-outside ml-6 my-6 space-y-2">
                {children}
            </ul>
        ),
        number: ({ children }: any) => (
            <ol className="list-decimal list-outside ml-6 my-6 space-y-2">
                {children}
            </ol>
        ),
    },

    listItem: {
        bullet: ({ children }: any) => (
            <li className="pl-2 text-gray-800">{children}</li>
        ),
        number: ({ children }: any) => (
            <li className="pl-2 text-gray-800">{children}</li>
        ),
    },
};

/**
 * Alternative: Portable Text Components dengan styling minimal
 */
export const minimalPortableTextComponents: PortableTextComponents = {
    types: {
        image: ({ value }: any) => {
            if (!value?.asset?.url) return null;
            return (
                <div className="my-4">
                    <Image
                        src={value.asset.url}
                        alt={value.alt || ''}
                        width={800}
                        height={450}
                        className="rounded w-full"
                    />
                </div>
            );
        },
    },
    marks: {
        link: ({ children, value }: any) => (
            <a href={value?.href} className="text-blue-600 underline">
                {children}
            </a>
        ),
    },
    block: {
        h2: ({ children }: any) => <h2 className="text-2xl font-bold my-4">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-xl font-bold my-3">{children}</h3>,
    },
};