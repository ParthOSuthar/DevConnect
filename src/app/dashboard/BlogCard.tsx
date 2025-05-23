'use client';

import React from 'react';
import Link from 'next/link';

interface BlogCardProps {
    id: string;
    title: string;
    image: string;
    description: string;
    authorName: string;
    authorId: string;
    createdAt: string;
    currentUserId: string | null;
    onDelete: (id: string) => void;
}

export default function BlogCard({
    id,
    title,
    image,
    description,
    authorName,
    authorId,
    createdAt,
    currentUserId,
    onDelete,
}: BlogCardProps) {
    const isOwner = currentUserId === authorId;

    return (
        <div className="border rounded-lg shadow p-4 bg-white dark:bg-gray-900 flex flex-col">
            <img src={image} alt={title} className="w-full h-48 object-cover rounded mb-3" />
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                By {authorName} on {new Date(createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-800 dark:text-gray-200 flex-grow">{description}</p>

            <div className="mt-4 flex justify-between">
                <Link href={`/dashboard/blogs/${id}/comments`}>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                        💬 Comment
                    </button>
                </Link>

                {isOwner && (
                    <div className="flex gap-2">
                        <Link href={`/dashboard/blogs/${id}`}>
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">
                                ✏️ Edit
                            </button>
                        </Link>
                        <button
                            onClick={() => onDelete(id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
