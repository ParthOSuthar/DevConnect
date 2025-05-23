'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function BlogComments({ blogId }: { blogId: string }) {
    const { data: session } = useSession();
    const user = session?.user;

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        const res = await fetch(`/api/comments?blogId=${blogId}`);
        const data = await res.json();
        setComments(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setLoading(true);
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blogId,
                    userId: user?.id,
                    description: newComment.trim(),
                }),
            });

            if (!res.ok) throw new Error('Failed to post comment');

            setNewComment('');
            toast.success('Comment added');
            fetchComments();
        } catch {
            toast.error('Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/comments/${id}`, { method: 'DELETE' });
            toast.success('Comment deleted');
            fetchComments();
        } catch {
            toast.error('Delete failed');
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
                💬 Comments
            </h3>

            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    className="w-full border border-gray-700 bg-gray-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    {loading ? 'Posting...' : 'Post Comment'}
                </button>
            </form>

            <div className="space-y-4">
                {comments.map((comment: any) => (
                    <div key={comment.id} className="border border-gray-700 p-4 rounded-lg bg-gray-800 text-white shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                            <p className="font-semibold text-blue-400">{comment.user.name}</p>
                            {user?.id === comment.userId && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                        <p className="text-sm">{comment.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date(comment.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
