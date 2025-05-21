import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import { ReactNode } from 'react'
import { getUserByEmail } from '@/lib/userService'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions)
    const userEmail = session.user.email
    const user = await getUserByEmail(userEmail)

    return (
        <div>
            <Navbar userName={user.name} />
            <main>{children}</main>
        </div>
    )
}
