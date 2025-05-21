import { Role } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'

export async function getUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    })
}

export async function updateUserRole(userId: string, newRole: Role) {
    return await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
    })
}
