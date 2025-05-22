import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const blogId = params.id;

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const blog = await prisma.blog.findUnique({ where: { id: blogId } });

    if (!blog || blog.userId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized to delete this blog' }, { status: 403 });
    }

    await prisma.blog.delete({ where: { id: blogId } });

    return NextResponse.json({ message: 'Blog deleted' }, { status: 200 });
}

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params;

    try {
        const blog = await prisma.blog.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File;

    try {
        let imageUrl: string | null = null;

        if (image && image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const ext = image.name.split('.').pop();
            const filename = `${uuidv4()}.${ext}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');

            await writeFile(`${uploadDir}/${filename}`, buffer);
            imageUrl = `/uploads/${filename}`;
        }

        const existing = await prisma.blog.findUnique({
            where: { id: params.id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        const updated = await prisma.blog.update({
            where: { id: params.id },
            data: {
                title,
                description,
                image: imageUrl || existing.image, // use new or existing image
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }
}
