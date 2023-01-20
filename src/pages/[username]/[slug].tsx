import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import { firestore, getUserWithUsername, postToJSON } from '@/lib/firebase';
import {collection, doc, getDoc, collectionGroup, getDocs, query} from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore';


export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if (userDoc) {
        console.log("teste1");
        const postRef = doc(collection(firestore, userDoc.ref.path, 'posts'), slug);

        post = postToJSON((await getDoc(postRef)));

        path = postRef.path;
    }

    return {
        props: { post, path },
        revalidate: 5000,
    };
}

export async function getStaticPaths() {
    // Improve my using Admin SDK to select empty docs
    console.log("teste2");
    const snapshot = await getDocs(collectionGroup(firestore, 'posts'));

    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug },
        };
    });

    return {
        // must be in this format:
        // paths: [
        //   { params: { username, slug }}
        // ],
        paths,
        fallback: 'blocking',
    };
}

export default function Post(props: { path: string; post: any; }) {
    const postRef = doc(firestore, props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;

    return (
        <main className={styles.container}>

            <section>
                <PostContent post={post} />
            </section>

            <aside className="card">
                <p>
                    <strong>{post.heartCount || 0} 🤍</strong>
                </p>

            </aside>
        </main>
    );
}
