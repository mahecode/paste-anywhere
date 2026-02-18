import { nanoid } from 'nanoid';

/**
 * Threshold (in bytes) below which content is encoded directly in the QR.
 * Above this threshold the content is stored in Redis and a URL is encoded instead.
 * QR codes at level "M" support ~2331 bytes; 1500 is a safe, scannable limit.
 */
export const DIRECT_QR_THRESHOLD = 1500;

/**
 * Return the UTF-8 byte size of a string
 */
export function getByteSize(str: string): number {
    return new Blob([str]).size;
}

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
    // In the browser, use the current origin
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/${id}`;
    }

    // Fallback for SSR or if window is not available
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
