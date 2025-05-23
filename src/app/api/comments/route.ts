import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get('blogId');

    const comments = await prisma.comment.findMany({
        where: blogId ? { blogId } : undefined,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
}

export async function POST(req: Request) {
    const { blogId, userId, description } = await req.json();

    if (!blogId || !userId || !description) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
        data: { blogId, userId, description },
    });

    return NextResponse.json(comment);
}
