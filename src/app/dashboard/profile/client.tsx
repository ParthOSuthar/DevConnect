'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ProfileClient({ user }: { user: any }) {
    const router = useRouter()

    // Form state
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Set initial form values when session is ready
    useEffect(() => {
        setName(user.name)
        setEmail(user.email)
        setRole(user.role)
    }, [user])

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const res = await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
        })

        setIsLoading(false)

        if (res.ok) {
            toast.success('Profile updated!')
            router.refresh()
        } else {
            toast.error('Failed to update profile')
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-12 p-6 rounded-lg bg-white dark:bg-gray-900 shadow-md">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Update Profile
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:ring-blue-500 focus:border-blue-500 p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:ring-blue-500 focus:border-blue-500 p-2"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Role
                    </label>
                    <input
                        type="text"
                        value={role}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:ring-blue-500 focus:border-blue-500 p-2"
                        readOnly
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    )
}
