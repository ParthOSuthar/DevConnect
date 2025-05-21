import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getUserByEmail } from '@/lib/userService'
import ProfileClient from './client'

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        redirect('/')
    }

    const user = await getUserByEmail(session.user.email)

    return <ProfileClient user={user} />
}
