import {auth, firestore} from "@/lib/firebase";
import {signInWithPopup, GoogleAuthProvider, signOut} from "firebase/auth";
import { doc, writeBatch, getDoc } from "firebase/firestore";
import {useContext, useEffect, useState, useCallback} from "react";
import {UserContext} from "@/lib/context";
import debounce from "lodash.debounce";
import Image from "next/image";
import googleIcon from "@/../public/google.jpg";


export default function EnterPage({}) {
    const { user, username } = useContext(UserContext)

    return (

        // 1. user signed out <SignInButton />
        // 2. user signed in, but missing username <UsernameForm />
        // 3. user signed in, has username <SignOutButton />
        <main>
            {user ?
                username ? <SignOutButton /> : <UsernameForm />
                :
                <SignInButton />
            }
        </main>
    )
}

function SignOutButton() {
    return <button onClick={() => signOut(auth)}>Sign Out</button>;
}

function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, new GoogleAuthProvider())
    }

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <Image src={googleIcon} alt="Google icon image for sign up" width="30" height="30"/> Sign in with Google
        </button>
    );
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext)

    const onSubmit = async (e) => {
        e.preventDefault();

        // create refs for both documents
        console.log("abacate2")
        const userDoc = doc(firestore, `users/${user.uid}`);
        console.log("abacate3")
        const usernameDoc = doc(firestore, `usernames/${formValue}`);


        console.log("abacate4")
        const batch = writeBatch(firestore);
        batch.set(userDoc, {username: formValue, photoURL: user.photoURL, displayName: user.displayName});
        batch.set(usernameDoc, {uid: user.uid});

        console.log("abacate5")
        await batch.commit();
    };

    const onChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work
    const checkUsername = useCallback(
        debounce(async (username: string | any[]) => {
            if (username.length >= 3) {
                console.log("abacate6")
                const ref = doc(firestore,`usernames/${username}`);
                console.log("abacate7")
                const documentDataDocumentSnapshot = await getDoc(ref);
                console.log("abacate8")
                console.log('Firestore read executed!');
                setIsValid(!documentDataDocumentSnapshot.exists());
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
}

    function UsernameMessage({ username, isValid, loading }) {
        if (loading) {
            return <p>Checking...</p>;
        } else if (isValid) {
            return <p className="text-success">{username} is available!</p>;
        } else if (username && !isValid) {
            return <p className="text-danger">That username is taken!</p>;
        } else {
            return <p></p>;
        }
    }
