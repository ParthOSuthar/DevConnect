import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Deleted' });
}

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params;

    try {
        const project = await prisma.project.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;

    try {

        const existing = await prisma.project.findUnique({
            where: { id: params.id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const updated = await prisma.project.update({
            where: { id: params.id },
            data: {
                title,
                description,
                link,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}
