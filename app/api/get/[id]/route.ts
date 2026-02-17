import { NextRequest, NextResponse } from 'next/server';
import { getContent } from '@/lib/redis';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'Missing ID parameter' },
                { status: 400 }
            );
        }

        // Retrieve content (this also deletes it from Redis)
        const content = await getContent(id);

        if (!content) {
            return NextResponse.json(
                { error: 'Content not found or expired' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            type: content.type,
            content: content.content,
            createdAt: content.createdAt,
        });
    } catch (error) {
        console.error('Error retrieving content:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve content' },
            { status: 500 }
        );
    }
}
