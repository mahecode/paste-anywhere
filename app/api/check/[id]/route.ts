import { NextRequest, NextResponse } from 'next/server';
import { contentExists } from '@/lib/redis';

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

        const exists = await contentExists(id);
        console.log(`Checking existence for ID: ${id}, Result: ${exists}, UA: ${request.headers.get('user-agent')}`);

        return NextResponse.json({ exists });
    } catch (error) {
        console.error('Error checking content:', error);
        return NextResponse.json(
            { error: 'Failed to check content' },
            { status: 500 }
        );
    }
}
