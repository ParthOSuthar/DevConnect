import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const project = await prisma.project.create({
        data: {
            title: body.title,
            description: body.description,
            link: body.link,
            userId: user.id,
        },
    });

    return NextResponse.json(project);
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });

    const projects = await prisma.project.findMany({
        include: {
            user: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
}