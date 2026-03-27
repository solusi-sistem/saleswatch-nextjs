import { client } from "@/lib/sanity";
import { proxyFetch } from "@/lib/sanityFetcher";
import { BlogItem, BlogCategory } from "@/types/list/Blog";
import { groq } from "next-sanity";
import { cache } from "react";

const isBrowser = typeof window !== 'undefined';

// Query fragment untuk blog dengan kategori
const blogFieldsQuery = `
    _id,
    _type,
    title {
        en,
        id
    },
    slug {
        current,
        _type
    },
    excerpt {
        en,
        id
    },
    date,
    category->{
        _id,
        name {
            en,
            id
        },
        slug {
            current,
            _type
        },
        description {
            en,
            id
        },
        status
    },
    author,
    image {
        asset->{
            _id,
            url
        },
        alt {
            en,
            id
        }
    },
    content {
        en,
        id
    },
    tags,
    seo {
        metaTitle {
            en,
            id
        },
        metaDescription {
            en,
            id
        },
        keywords {
            en,
            id
        }
    },
    featured,
    status
`;

export const getAllBlogs = cache(async function(
    status?: 'published' | 'draft' | 'archived',
    featured?: boolean,
    sortBy: 'dateDesc' | 'dateAsc' | 'titleAsc' = 'dateDesc'
): Promise<BlogItem[] | null> {
    let filterConditions = '_type == "list_blog"';

    if (status) {
        filterConditions += ` && status == "${status}"`;
    }

    if (featured !== undefined) {
        filterConditions += ` && featured == ${featured}`;
    }

    let orderBy = '';
    switch (sortBy) {
        case 'dateDesc':
            orderBy = '| order(date desc)';
            break;
        case 'dateAsc':
            orderBy = '| order(date asc)';
            break;
        case 'titleAsc':
            orderBy = '| order(title.en asc)';
            break;
        default:
            orderBy = '| order(date desc)';
    }

    const query = groq`*[${filterConditions}] ${orderBy} {
        ${blogFieldsQuery}
    }`;

    try {
        // use proxy if in browser, use client if on server
        if (isBrowser) {
            return await proxyFetch<BlogItem[]>(query, {});
        }
        return await client.fetch<BlogItem[]>(query, {}, { next: { revalidate: 86400 } });
    } catch (error) {
        console.error("Error fetching all blogs:", error);
        return null;
    }
});

export const getBlogBySlug = cache(async function(slug: string): Promise<BlogItem | null> {
    const query = groq`*[_type == "list_blog" && slug.current == $slug][0] {
        ${blogFieldsQuery}
    }`;

    try {
        if (isBrowser) return await proxyFetch<BlogItem>(query, { slug });
        return await client.fetch<BlogItem>(query, { slug }, { next: { revalidate: 86400 } });
    } catch (error) {
        console.error("Error fetching blog by slug:", error);
        return null;
    }
});

export const getBlogsByCategory = cache(async function(
    categorySlug: string,
    status: 'published' | 'draft' | 'archived' = 'published'
): Promise<BlogItem[] | null> {
    const query = groq`*[
        _type == "list_blog" 
        && status == $status
        && category->slug.current == $categorySlug
    ] | order(date desc) {
        ${blogFieldsQuery}
    }`;

    try {
        if (isBrowser) return await proxyFetch<BlogItem[]>(query, { status, categorySlug });
        return await client.fetch<BlogItem[]>(query, { status, categorySlug }, { next: { revalidate: 86400 } });
    } catch (error) {
        console.error("Error fetching blogs by category:", error);
        return null;
    }
});

export const getAllCategories = cache(async function(): Promise<BlogCategory[] | null> {
    const query = groq`*[_type == "list_blog_category" && status == "active"] | order(name.en asc) {
        _id,
        name {
            en,
            id
        },
        slug {
            current,
            _type
        },
        description {
            en,
            id
        },
        status
    }`;

    try {
        if (isBrowser) return await proxyFetch<BlogCategory[]>(query, {});
        return await client.fetch<BlogCategory[]>(query, {}, { next: { revalidate: 86400 } });
    } catch (error) {
        console.error("Error fetching blog categories:", error);
        return null;
    }
});

export const getCategoryBySlug = cache(async function(slug: string): Promise<BlogCategory | null> {
    const query = groq`*[_type == "list_blog_category" && slug.current == $slug][0] {
        _id,
        name {
            en,
            id
        },
        slug {
            current,
            _type
        },
        description {
            en,
            id
        },
        status
    }`;

    try {
        if (isBrowser) return await proxyFetch<BlogCategory>(query, { slug });
        return await client.fetch<BlogCategory>(query, { slug }, { next: { revalidate: 86400 } });
    } catch (error) {
        console.error("Error fetching category by slug:", error);
        return null;
    }
});

export const getBlogsWithPagination = cache(async function(
    page: number = 1,
    postsPerPage: number = 6,
    status: 'published' | 'draft' | 'archived' = 'published',
    categorySlug?: string
): Promise<{
    posts: BlogItem[];
    currentPage: number;
    totalPages: number;
    totalPosts: number;
} | null> {
    const offset = (page - 1) * postsPerPage;

    let filterConditions = `_type == "list_blog" && status == $status`;

    if (categorySlug) {
        filterConditions += ` && category->slug.current == $categorySlug`;
    }

    const countQuery = groq`count(*[${filterConditions}])`;
    const postsQuery = groq`*[${filterConditions}] | order(date desc) [$offset...$limit] {
        ${blogFieldsQuery}
    }`;

    try {
        const params = categorySlug ? { status, categorySlug, offset, limit: offset + postsPerPage } : { status, offset, limit: offset + postsPerPage };

        if (isBrowser) {
            const totalPosts = await proxyFetch<number>(countQuery, params) || 0;
            const posts = await proxyFetch<BlogItem[]>(postsQuery, params) || [];
            return { posts, currentPage: page, totalPages: Math.ceil(totalPosts / postsPerPage), totalPosts };
        }

        const totalPosts = await client.fetch<number>(countQuery, params, { next: { revalidate: 86400 } });
        const posts = await client.fetch<BlogItem[]>(postsQuery, params, { next: { revalidate: 86400 } });
        return { posts: posts || [], currentPage: page, totalPages: Math.ceil(totalPosts / postsPerPage), totalPosts };
    } catch (error) {
        console.error("Error fetching blogs with pagination:", error);
        return null;
    }
});

/**
 * ✅ FIXED: Get related/similar blog posts based on same category
 */
export const getRelatedBlogs = cache(async function(
    currentBlogId: string,
    limit: number = 3,
    categorySlug?: string
): Promise<BlogItem[] | null> {
    // Build filter conditions
    let filterConditions = `_type == "list_blog" && _id != $currentBlogId && status == "published"`;

    if (categorySlug) {
        filterConditions += ` && category->slug.current == $categorySlug`;
    }

    const query = groq`*[${filterConditions}] | order(date desc) [0...$limit] {
        ${blogFieldsQuery}
    }`;

    try {
        const params = categorySlug ? { currentBlogId, categorySlug, limit } : { currentBlogId, limit };
        if (isBrowser) return await proxyFetch<BlogItem[]>(query, params);
        return await client.fetch<BlogItem[]>(query, params, { next: { revalidate: 86400 } });
    } catch (error) {
        console.error("Error fetching related blogs:", error);
        return null;
    }
});

export const getRecentBlogs = cache(async function(
    limit: number = 5,
    excludeId?: string
): Promise<BlogItem[] | null> {
    let filterConditions = '_type == "list_blog" && status == "published"';

    if (excludeId) {
        filterConditions += ` && _id != "${excludeId}"`;
    }

    const query = groq`*[${filterConditions}] | order(date desc) [0...$limit] {
        ${blogFieldsQuery}
    }`;

    try {
        if (isBrowser) return await proxyFetch<BlogItem[]>(query, { limit });
        return await client.fetch<BlogItem[]>(query, { limit }, { next: { revalidate: 86400 } });
    } catch (error) {
        console.error("Error fetching recent blogs:", error);
        return null;
    }
});

/**
 * DEPRECATED: Use getAllCategories instead
 */
export async function getBlogCategories(): Promise<Array<{ en: string; id: string }> | null> {
    console.warn('getBlogCategories is deprecated. Use getAllCategories instead.');

    const categories = await getAllCategories();
    if (!categories) return null;

    return categories.map(cat => ({
        en: cat.name.en,
        id: cat.name.id
    }));
}
