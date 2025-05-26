'use client';

import React from 'react';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

interface ProjectCardProps {
    id: string;
    title: string;
    link: string;
    description: string;
    authorName: string;
    authorId: string;
    createdAt: string;
    currentUserId: string | null;
    onDelete: (id: string) => void;
}

export default function ProjectCard({
    id,
    title,
    link,
    description,
    authorName,
    authorId,
    createdAt,
    currentUserId,
    onDelete,
}: ProjectCardProps) {
    const isOwner = currentUserId === authorId;

    return (
        <div className="border border-gray-300 dark:border-gray-700 rounded-lg shadow p-5 bg-white dark:bg-gray-900 flex flex-col gap-3 transition-all hover:shadow-md">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    By {authorName} on {new Date(createdAt).toLocaleDateString()}
                </p>
            </div>

            <p className="text-gray-800 dark:text-gray-200">{description}</p>

            {link && (
                <div className="mt-2">
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                    >
                        <FaGithub className="text-lg" />
                        View on GitHub
                    </a>
                </div>
            )}

            {isOwner && (
                <div className="mt-4 flex gap-3">
                    <Link href={`/dashboard/projects/${id}`}>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 text-sm rounded">
                            ✏️ Edit
                        </button>
                    </Link>
                    <button
                        onClick={() => onDelete(id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded"
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}
        </div>
    );
}
