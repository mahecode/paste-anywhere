import { NextRequest, NextResponse } from 'next/server';
import { storeContent, StoredContent } from '@/lib/redis';
import { generateId, buildShareUrl, isValidFileSize } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, content } = body;
        console.log('Received share request:', { type, size: content?.length, userAgent: request.headers.get('user-agent') });

        // Validate input
        if (!type || !content) {
            return NextResponse.json(
                { error: 'Missing required fields: type and content' },
                { status: 400 }
            );
        }

        if (type !== 'text' && type !== 'image') {
            return NextResponse.json(
                { error: 'Invalid type. Must be "text" or "image"' },
                { status: 400 }
            );
        }

        // Check content size (approximate - base64 for images)
        const contentSize = new Blob([content]).size;
        if (!isValidFileSize(contentSize)) {
            return NextResponse.json(
                { error: 'Content too large. Maximum size is 10MB' },
                { status: 413 }
            );
        }

        // Generate unique ID
        const id = generateId();

        // Store in Redis with 5-minute TTL
        const data: StoredContent = {
            type,
            content,
            createdAt: Date.now(),
            accessed: false,
        };

        console.log(`Storing content for ID: ${id}`);
        await storeContent(id, data, 300); // 5 minutes
        console.log(`Content stored successfully for ID: ${id}`);

        // Build shareable URL
        const url = buildShareUrl(id);

        return NextResponse.json({
            id,
            url,
            expiresIn: 300, // seconds
        });
    } catch (error) {
        console.error('Error storing content:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `Failed to store content: ${errorMessage}` },
            { status: 500 }
        );
    }
}
