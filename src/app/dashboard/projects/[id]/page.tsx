'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditProjectPage() {
    const { id } = useParams();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/projects/${id}`);
                if (!res.ok) throw new Error('Failed to fetch project');
                const project = await res.json();
                setTitle(project.title);
                setLink(project.link || '');
                setDescription(project.description);
            } catch (error) {
                toast.error('Error loading project');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProject();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('link', link);
            formData.append('description', description);

            const res = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to update project');
            toast.success('Project updated successfully');
            router.push('/dashboard?tab=projects');
        } catch (error) {
            toast.error('Update failed');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow dark:bg-gray-800">
            <h2 className="text-2xl font-semibold mb-6">✏️ Edit Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Title</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Link</label>
                    <input
                        type="url"
                        className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Description</label>
                    <textarea
                        className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
