import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import {firestore, getUserWithUsername, postToJSON} from "@/lib/firebase";
import { collection, where, orderBy, limit, getDocs, query as firestoreQuery } from 'firebase/firestore'
import Metatags from "@/components/Metatags";

export async function getServerSideProps({ query } : any) {
    const { username } = query;

    const userDoc = await getUserWithUsername(username);

    // JSON serializable data
    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();
        const postsQuery = firestoreQuery(
            collection(firestore, userDoc.ref.path, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(5))

        posts = (await getDocs(postsQuery)).docs.map(postToJSON);

    } else { // If no user, short circuit to 404 page
        return {
            notFound: true,
        };
    }

    console.log("user : ", user);
    console.log("posts : ", posts);

    return {
        props: { user, posts }, // will be passed to the page component as props
    };
}

export default function UserProfilePage({ user, posts } : any) {
    console.log("bonga: " + posts);

    return (
        <main>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    );
}
