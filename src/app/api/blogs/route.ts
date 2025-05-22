import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { v4 as uuid } from 'uuid';
import fs from 'fs';

// POST: Create a new blog
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const formData = await req.formData();

        const title = formData.get('title')?.toString() || '';
        const description = formData.get('description')?.toString() || '';
        const file = formData.get('image') as File;

        if (!title || !description || !file) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Ensure the /public/uploads folder exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uniqueName = `${uuid()}-${file.name}`;
        const filePath = path.join(uploadDir, uniqueName);

        await writeFile(filePath, buffer);

        const imagePath = `/uploads/${uniqueName}`;

        const blog = await prisma.blog.create({
            data: {
                title,
                description,
                image: imagePath,
                user: {
                    connect: {
                        email: session.user.email!,
                    },
                },
            },
        });

        return NextResponse.json(blog, { status: 201 });
    } catch (error) {
        console.error('Error creating blog:', error);
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
}

// GET: Fetch all blogs
export async function GET() {
    try {
        const blogs = await prisma.blog.findMany({
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(blogs, { status: 200 });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}
