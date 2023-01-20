import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Metatags from "@/components/Metatags";

// UI component for main post content
export default function PostContent({ post }) {
    const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

    return (
        <div className="card">
            <Metatags title={post.title} description={post.title} image={post.title} />
            <h1>{post?.title}</h1>
            <span className="text-sm">
        Written by{' '}
                <Link className="text-info" href={`/${post.username}/`}>
          @{post.username}
        </Link>{' '}
                on {createdAt.toISOString()}
      </span>
            <ReactMarkdown>{post?.content}</ReactMarkdown>
        </div>
    );
}
