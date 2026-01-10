import { client } from "@/lib/sanity";
import { BlogItem } from "@/types/list/Blog";
import { groq } from "next-sanity";

/**
 * Fungsi untuk mengambil semua blog posts dari Sanity
 * @param status - Filter berdasarkan status (optional): 'published' | 'draft' | 'archived'
 * @param featured - Filter berdasarkan featured status (optional): true | false
 * @param sortBy - Urutan sorting (optional): 'dateDesc' | 'dateAsc' | 'titleAsc'
 * @returns Array of BlogItem atau null jika error
 */
export async function getAllBlogs(
    status?: 'published' | 'draft' | 'archived',
    featured?: boolean,
    sortBy: 'dateDesc' | 'dateAsc' | 'titleAsc' = 'dateDesc'
): Promise<BlogItem[] | null> {

    // Build filter conditions
    let filterConditions = '_type == "list_blog"';

    if (status) {
        filterConditions += ` && status == "${status}"`;
    }

    if (featured !== undefined) {
        filterConditions += ` && featured == ${featured}`;
    }

    // Define sorting
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
        category {
            en,
            id
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
    }`;

    try {
        const result = await client.fetch<BlogItem[]>(query, {}, { cache: "no-store" });
        console.log(`Fetched ${result?.length || 0} blog posts from Sanity`);
        return result || [];
    } catch (error) {
        console.error("Error fetching all blogs:", error);
        return null;
    }
}

/**
 * Fungsi untuk mengambil blog post berdasarkan slug
 * @param slug - Slug dari blog post
 * @returns BlogItem atau null
 */
export async function getBlogBySlug(slug: string): Promise<BlogItem | null> {
    const query = groq`*[_type == "list_blog" && slug.current == $slug][0] {
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
        category {
            en,
            id
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
        tags,
        content {
            en,
            id
        },
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
    }`;

    try {
        const result = await client.fetch<BlogItem>(query, { slug }, { cache: "no-store" });
        console.log("Blog post by slug:", result ? "Found" : "Not found");
        return result || null;
    } catch (error) {
        console.error("Error fetching blog by slug:", error);
        return null;
    }
}

/**
 * Fungsi untuk mengambil blog posts dengan pagination
 * @param page - Halaman yang ingin diambil (dimulai dari 1)
 * @param postsPerPage - Jumlah posts per halaman
 * @param status - Filter berdasarkan status (optional)
 * @returns Object dengan posts dan metadata pagination
 */
export async function getBlogsWithPagination(
    page: number = 1,
    postsPerPage: number = 6,
    status: 'published' | 'draft' | 'archived' = 'published'
): Promise<{
    posts: BlogItem[];
    currentPage: number;
    totalPages: number;
    totalPosts: number;
} | null> {

    const offset = (page - 1) * postsPerPage;

    const countQuery = groq`count(*[_type == "list_blog" && status == $status])`;
    const postsQuery = groq`*[_type == "list_blog" && status == $status] | order(date desc) [$offset...$limit] {
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
        category {
            en,
            id
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
    }`;

    try {
        const totalPosts = await client.fetch<number>(countQuery, { status }, { cache: "no-store" });
        const posts = await client.fetch<BlogItem[]>(
            postsQuery,
            {
                status,
                offset,
                limit: offset + postsPerPage
            },
            { cache: "no-store" }
        );

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
 * Fungsi untuk mengambil related/similar blog posts
 * @param currentBlogId - ID blog post saat ini
 * @param category - Kategori blog (en atau id)
 * @param limit - Jumlah related posts yang ingin diambil
 * @returns Array of BlogItem
 */
export async function getRelatedBlogs(
    currentBlogId: string,
    category: string,
    limit: number = 3
): Promise<BlogItem[] | null> {

    const query = groq`*[
        _type == "list_blog" 
        && _id != $currentBlogId 
        && status == "published"
        && (category.en == $category || category.id == $category)
    ] | order(date desc) [0...$limit] {
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
        category {
            en,
            id
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
        featured,
        status
    }`;

    try {
        const result = await client.fetch<BlogItem[]>(
            query,
            { currentBlogId, category, limit },
            { cache: "no-store" }
        );
        console.log(`Fetched ${result?.length || 0} related blog posts`);
        return result || [];
    } catch (error) {
        console.error("Error fetching related blogs:", error);
        return null;
    }
}

/**
 * Fungsi untuk mengambil blog posts terbaru
 * @param limit - Jumlah posts yang ingin diambil
 * @param excludeId - ID blog yang ingin di-exclude (optional)
 * @returns Array of BlogItem
 */
export async function getRecentBlogs(
    limit: number = 5,
    excludeId?: string
): Promise<BlogItem[] | null> {

    let filterConditions = '_type == "list_blog" && status == "published"';

    if (excludeId) {
        filterConditions += ` && _id != "${excludeId}"`;
    }

    const query = groq`*[${filterConditions}] | order(date desc) [0...$limit] {
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
        category {
            en,
            id
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
        featured,
        status
    }`;

    try {
        const result = await client.fetch<BlogItem[]>(
            query,
            { limit },
            { cache: "no-store" }
        );
        console.log(`Fetched ${result?.length || 0} recent blog posts`);
        return result || [];
    } catch (error) {
        console.error("Error fetching recent blogs:", error);
        return null;
    }
}

/**
 * Fungsi untuk mengambil kategori blog yang unik
 * @returns Array of categories dalam format bilingual
 */
export async function getBlogCategories(): Promise<Array<{ en: string; id: string }> | null> {
    const query = groq`array::unique(*[_type == "list_blog" && status == "published"].category)`;

    try {
        const result = await client.fetch<Array<{ en: string; id: string }>>(
            query,
            {},
            { cache: "no-store" }
        );
        console.log(`Fetched ${result?.length || 0} blog categories`);
        return result || [];
    } catch (error) {
        console.error("Error fetching blog categories:", error);
        return null;
    }
}