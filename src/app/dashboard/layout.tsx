import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import { ReactNode } from 'react'
import { getUserByEmail } from '@/lib/userService'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions)
    const userEmail = session.user.email
    const user = await getUserByEmail(userEmail)
    const userName = user.name || 'Test User'

    return (
        <div>
            <Navbar userName={userName} />
            <main>{children}</main>
        </div>
    )
}
