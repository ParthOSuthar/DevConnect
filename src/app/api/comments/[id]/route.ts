import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
    params: { id: string };
}

export async function DELETE(_: Request, { params }: Params) {
    const comment = await prisma.comment.delete({
        where: { id: params.id },
    });

    return NextResponse.json(comment);
}
