import Link from "next/link";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { firestore, fromMillis, postToJSON } from '@/lib/firebase';
import {collectionGroup, query, where, orderBy, limit, getDocs, startAfter} from 'firebase/firestore'

import { useState } from 'react';
import PostFeed from "@/components/PostFeed";

// Max post to query per page
const LIMIT = 1;

export async function getServerSideProps(context) {
    const postsQuery = query(
        collectionGroup(firestore, 'posts'),
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        limit(LIMIT));

    const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

    return {
        props: { posts }, // will be passed to the page component as props
    };
}

export default function Home(props: { posts: any; }) {
    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);

    const [postsEnd, setPostsEnd] = useState(false);

    const getMorePosts = async () => {
        setLoading(true);
        const last = posts[posts.length - 1];

        const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

        const queryFirestore = query(
            collectionGroup(firestore, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            startAfter(cursor),
            limit(LIMIT));

        const newPosts = (await getDocs(queryFirestore)).docs.map((doc) => doc.data());

        setPosts(posts.concat(newPosts));
        setLoading(false);

        if (newPosts.length < LIMIT) {
            setPostsEnd(true);
        }
    };

    console.log("before")
    console.log(loading)


    return (
        <main>
            <PostFeed posts={posts} />

            {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

            <Loader show={loading} />

            {postsEnd && 'You have reached the end!'}
        </main>
    );
}
