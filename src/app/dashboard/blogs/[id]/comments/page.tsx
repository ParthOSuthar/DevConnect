import { notFound } from 'next/navigation';
import BlogComments from '@/app/dashboard/blogs/[id]/comment';
import { prisma } from '@/lib/prisma';

interface Props {
    params: { id: string };
}

export default async function CommentsPage({ params }: Props) {
    const blog = await prisma.blog.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            title: true,
            image: true
        },
    });

    if (!blog) return notFound();

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-white">{blog.title}</h1>
            <img
                src={blog.image || '/default-blog.png'}
                alt={blog.title}
                className="rounded-lg mb-6 w-full max-w-full object-cover shadow-md"
            />
            <BlogComments blogId={blog.id} />
        </div>
    );
}
