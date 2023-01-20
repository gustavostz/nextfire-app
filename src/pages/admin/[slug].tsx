import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth, serverTimestamp } from '@/lib/firebase';
import { collection, doc, orderBy, query as queryFirestore, setDoc, updateDoc } from 'firebase/firestore';

import { useState } from 'react';
import { useRouter } from 'next/router';

import {useDocumentData, useDocumentDataOnce} from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminPostEdit(props) {
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    );
}

function PostManager() {
    const [preview, setPreview] = useState(false);

    console.log("teste1")
    const router = useRouter();
    const { slug } = router.query;
    console.log("teste2")


    const postRef = doc(collection(firestore, 'users', auth.currentUser.uid, 'posts'), slug.toString());
    const [post] = useDocumentData(postRef);
    console.log("teste3")


    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                    </section>

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button className="btn-blue">Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    );
}

function PostForm({ defaultValues, postRef, preview }) {
    console.log("teste4")

    const { register, handleSubmit, reset, watch } = useForm({ defaultValues, mode: 'onChange' });

    console.log(register)

    const updatePost = async ({ content, published }) => {
        console.log("teste4")

        await updateDoc(postRef, {
            content,
            published,
            updatedAt: serverTimestamp(),
        });
        // await postRef.update({
        //     content,
        //     published,
        //     updatedAt: serverTimestamp(),
        // });

        reset({ content, published });

        toast.success('Post updated successfully!')
    };
    console.log("teste5")

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}>

                <textarea name="content" defaultValue={defaultValues.content}></textarea>

                <fieldset>
                    <input className={styles.checkbox} name="published" type="checkbox" defaultChecked={defaultValues.published} />
                    <label>Published</label>
                </fieldset>

                <button type="submit" className="btn-green">
                    Save Changes
                </button>
            </div>
        </form>
    );
}
