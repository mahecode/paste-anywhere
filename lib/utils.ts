import { nanoid } from 'nanoid';

/**
 * Generate a unique 8-character ID
 */
export function generateId(): string {
    return nanoid(8);
}

/**
 * Build the full shareable URL for a given ID
 */
export function buildShareUrl(id: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/${id}`;
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate file size (max 10MB)
 */
export function isValidFileSize(bytes: number): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return bytes <= maxSize;
}
