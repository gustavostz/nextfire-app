import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {collection, connectFirestoreEmulator, getDocs, getFirestore, limit, query, where, Timestamp, serverTimestamp as serverTimestampFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";


// Initialize firebase
const firebase = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
});


const firestore = getFirestore(firebase);
// connectFirestoreEmulator(firestore, "localhost", 8080);
export {firestore};
export const auth = getAuth(firebase);

export const storage = getStorage(firebase);

export const fromMillis = Timestamp.fromMillis;

export const serverTimestamp = serverTimestampFirestore


//   Gets a users/{uid} document with username
export async function getUserWithUsername(username: string) {
    const q = query(collection(firestore, 'users'), where('username', '==', username), limit(1));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs[0];
}

//  Converts a firestore document to JSON
//  @param  {DocumentSnapshot} doc
export function postToJSON(doc: { data: () => any; }) {
    console.log("treta8")
    console.log(doc);
    const data = doc.data();
    return {
        ...data,
        // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    };
}
