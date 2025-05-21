'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

export default function Client({ userName }: { userName: string }) {
    const [activeTab, setActiveTab] = useState<'blogs' | 'projects'>('blogs')

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="p-6">
                {/* Tab Buttons */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('blogs')}
                        className={`px-4 py-2 rounded transition ${activeTab === 'blogs'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                    >
                        Blogs
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-4 py-2 rounded transition ${activeTab === 'projects'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                    >
                        Projects
                    </button>
                </div>

                {/* Tab Content */}
                <div className="border border-gray-300 dark:border-gray-700 p-6 rounded bg-white dark:bg-gray-800 shadow">
                    {activeTab === 'blogs' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2">📚 Blog Section</h2>
                            <p>This section will display and manage blogs.</p>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2">🚀 Project Section</h2>
                            <p>This section will handle all user projects.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
