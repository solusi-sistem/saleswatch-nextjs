import { PageData, Section } from "@/types/page";

// Fungsi untuk check apakah page sudah published
export function isPagePublished(pageData: PageData | null): boolean {
    if (!pageData) return false;

    // Jika published_at adalah boolean
    if (typeof pageData.published_at === 'boolean') {
        return pageData.published_at;
    }

    // Jika published_at adalah string (tanggal)
    if (typeof pageData.published_at === 'string') {
        const publishDate = new Date(pageData.published_at);
        const now = new Date();
        return publishDate <= now;
    }

    return false;
}

// Fungsi untuk check apakah section sudah published
export function isSectionPublished(section: Section): boolean {
    // Jika published_at adalah boolean
    if (typeof section.published_at === 'boolean') {
        return section.published_at;
    }

    // Jika published_at adalah string (tanggal)
    if (typeof section.published_at === 'string') {
        const publishDate = new Date(section.published_at);
        const now = new Date();
        return publishDate <= now;
    }

    return false;
}