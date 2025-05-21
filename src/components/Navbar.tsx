'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar({ userName }: { userName: string }) {
    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
            <Link href="/dashboard">
                <h1 className="text-xl font-bold">Dashboard</h1>
            </Link>

            <div className="flex items-center gap-4">
                <span className="text-sm">Hello, {userName}</span>

                <Link href="/dashboard/profile">
                    <button className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm">
                        Update Profile
                    </button>
                </Link>

                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}
