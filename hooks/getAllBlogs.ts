import { client } from "@/lib/sanity";
import { BlogItem, BlogCategory } from "@/types/list/Blog";
import { groq } from "next-sanity";

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

export async function getAllBlogs(
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
        const result = await client.fetch<BlogItem[]>(query, {}, {
            next: { revalidate: 3600 }
        });
        console.log(`Fetched ${result?.length || 0} blog posts from Sanity`);
        return result || [];
    } catch (error) {
        console.error("Error fetching all blogs:", error);
        return null;
    }
}

export async function getBlogBySlug(slug: string): Promise<BlogItem | null> {
    const query = groq`*[_type == "list_blog" && slug.current == $slug][0] {
        ${blogFieldsQuery}
    }`;

    try {
        const result = await client.fetch<BlogItem>(query, { slug }, {
            next: { revalidate: 3600 }
        });
        console.log("Blog post by slug:", result ? "Found" : "Not found");
        return result || null;
    } catch (error) {
        console.error("Error fetching blog by slug:", error);
        return null;
    }
}

export async function getBlogsByCategory(
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
        const result = await client.fetch<BlogItem[]>(
            query, 
            { status, categorySlug },
            { next: { revalidate: 3600 } }
        );
        console.log(`Fetched ${result?.length || 0} posts for category: ${categorySlug}`);
        return result || [];
    } catch (error) {
        console.error("Error fetching blogs by category:", error);
        return null;
    }
}

export async function getAllCategories(): Promise<BlogCategory[] | null> {
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
        const result = await client.fetch<BlogCategory[]>(query, {}, {
            next: { revalidate: 3600 }
        });
        console.log(`Fetched ${result?.length || 0} blog categories`);
        return result || [];
    } catch (error) {
        console.error("Error fetching blog categories:", error);
        return null;
    }
}

export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
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
        const result = await client.fetch<BlogCategory>(query, { slug }, {
            next: { revalidate: 3600 }
        });
        return result || null;
    } catch (error) {
        console.error("Error fetching category by slug:", error);
        return null;
    }
}

export async function getBlogsWithPagination(
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
        const params = categorySlug 
            ? { status, categorySlug, offset, limit: offset + postsPerPage }
            : { status, offset, limit: offset + postsPerPage };

        const totalPosts = await client.fetch<number>(countQuery, params, {
            next: { revalidate: 3600 }
        });
        
        const posts = await client.fetch<BlogItem[]>(postsQuery, params, {
            next: { revalidate: 3600 }
        });

        const totalPages = Math.ceil(totalPosts / postsPerPage);

        console.log(`Fetched page ${page} of ${totalPages} (${posts.length} posts)`);

        return {
            posts: posts || [],
            currentPage: page,
            totalPages,
            totalPosts
        };
    } catch (error) {
        console.error("Error fetching blogs with pagination:", error);
        return null;
    }
}

/**
 * ✅ FIXED: Get related/similar blog posts based on same category
 */
export async function getRelatedBlogs(
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
        const params = categorySlug 
            ? { currentBlogId, categorySlug, limit }
            : { currentBlogId, limit };

        const result = await client.fetch<BlogItem[]>(query, params, {
            next: { revalidate: 3600 }
        });
        console.log(`Fetched ${result?.length || 0} related blog posts`);
        return result || [];
    } catch (error) {
        console.error("Error fetching related blogs:", error);
        return null;
    }
}

export async function getRecentBlogs(
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
        const result = await client.fetch<BlogItem[]>(
            query,
            { limit },
            { next: { revalidate: 3600 } }
        );
        console.log(`Fetched ${result?.length || 0} recent blog posts`);
        return result || [];
    } catch (error) {
        console.error("Error fetching recent blogs:", error);
        return null;
    }
}

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