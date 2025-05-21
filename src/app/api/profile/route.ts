import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { name, email, role } = await req.json()
    try {
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: { name, email, role },
        })

        return NextResponse.json({ success: true, user: updatedUser })
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }
}
