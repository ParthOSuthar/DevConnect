'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/confirmModal';
import ProjectCard from './ProjectCard';
import { useSearchParams } from 'next/navigation';

export default function Client({ role, currentUserId }: { role: string; currentUserId: string | null }) {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const initialTab = tabParam === 'projects' ? 'projects' : 'blogs';

    const [activeTab, setActiveTab] = useState<'blogs' | 'projects'>(initialTab);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deleteUrl, setDeleteUrl] = useState<string>('');
    const [deleteType, setDeleteType] = useState<'blog' | 'project'>('blog');
    const [showModal, setShowModal] = useState(false);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('/api/blogs');
            const data = await res.json();
            setBlogs(data);
        } catch (error) {
            toast.error('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        if (activeTab === 'blogs') {
            fetchBlogs();
        } else {
            fetchProjects();
        }
    }, [activeTab]);

    const confirmDelete = (id: string, type: 'blog' | 'project') => {
        setSelectedId(id);
        setDeleteType(type);
        setDeleteUrl(`/api/${type === 'blog' ? 'blogs' : 'projects'}/${id}`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!selectedId || !deleteUrl) return;

        try {
            const res = await fetch(deleteUrl, { method: 'DELETE' });
            if (res.ok) {
                if (deleteType === 'blog') {
                    setBlogs(prev => prev.filter(item => item.id !== selectedId));
                    toast.success('Blog deleted successfully!');
                } else {
                    setProjects(prev => prev.filter(item => item.id !== selectedId));
                    toast.success('Project deleted successfully!');
                }
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setSelectedId(null);
            setDeleteUrl('');
            setShowModal(false);
        }
    };

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
                    <ConfirmModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        onConfirm={handleDelete}
                        message={`Are you sure you want to delete this ${deleteType}?`}
                    />

                    {activeTab === 'blogs' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">📚 Blog Section</h2>
                            {role === 'ADMIN' && (
                                <div className="mb-4">
                                    <Link href={'/dashboard/blogs'}>
                                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                                            ➕ Create New Blog
                                        </button>
                                    </Link>
                                </div>
                            )}

                            {loading ? (
                                <p>Loading blogs...</p>
                            ) : blogs.length === 0 ? (
                                <p>No blogs found.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {blogs.map(blog => (
                                        <BlogCard
                                            key={blog.id}
                                            id={blog.id}
                                            title={blog.title}
                                            image={blog.image}
                                            description={blog.description}
                                            authorName={blog.user.name || 'Unknown'}
                                            authorId={blog.user.id}
                                            createdAt={blog.createdAt}
                                            currentUserId={currentUserId}
                                            onDelete={() => confirmDelete(blog.id, 'blog')}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2">🚀 Project Section</h2>
                            {role === 'ADMIN' && (
                                <div className="mb-4">
                                    <Link href={'/dashboard/projects/add'}>
                                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                                            ➕ Create New Project
                                        </button>
                                    </Link>
                                </div>
                            )}

                            {loading ? (
                                <p>Loading projects...</p>
                            ) : projects.length === 0 ? (
                                <p>No projects found.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {projects.map(project => (
                                        <ProjectCard
                                            key={project.id}
                                            id={project.id}
                                            title={project.title}
                                            link={project.link}
                                            description={project.description}
                                            authorName={project.user.name || 'Unknown'}
                                            authorId={project.user.id}
                                            createdAt={project.createdAt}
                                            currentUserId={currentUserId}
                                            onDelete={() => confirmDelete(project.id, 'project')}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
