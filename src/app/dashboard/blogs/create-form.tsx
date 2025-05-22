'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateBlogForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            const res = await fetch('/api/blogs', {
                method: 'POST',
                body: data,
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || 'Something went wrong');
            }

            router.push('/dashboard');
        } catch (err: any) {
            console.error('Error creating blog:', err);
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            {error && <p className="text-red-500">{error}</p>}

            <div>
                <label className="block font-semibold">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                />
            </div>
            <div>
                <label className="block font-semibold">Image File</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="w-full border rounded px-3 py-2"
                />
            </div>
            <div>
                <label className="block font-semibold">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Create Blog
            </button>
        </form>
    );
}
