'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditBlogPage() {
    const { id } = useParams();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/blogs/${id}`);
                if (!res.ok) throw new Error('Failed to fetch blog');
                const blog = await res.json();
                setTitle(blog.title);
                setDescription(blog.description);
                setExistingImage(blog.image || null);
            } catch (error) {
                toast.error('Error loading blog');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBlog();
    }, [id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const res = await fetch(`/api/blogs/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to update blog');
            toast.success('Blog updated successfully');
            router.push('/dashboard');
        } catch (error) {
            toast.error('Update failed');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow dark:bg-gray-800">
            <h2 className="text-2xl font-semibold mb-6">✏️ Edit Blog</h2>
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
                    <label className="block font-medium">Description</label>
                    <textarea
                        className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                {existingImage && (
                    <div>
                        <label className="block font-medium">Existing Image</label>
                        <img
                            src={existingImage}
                            alt={title}
                            className="w-full max-h-64 object-contain border rounded mb-2"
                        />
                    </div>
                )}

                <div>
                    <label className="block font-medium">New Image URL (optional)</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border rounded px-3 py-2"
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
