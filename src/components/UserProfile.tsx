// UI component for user profile
import Image from "next/image";

export default function UserProfile({ user }) {
    console.log(user);
    return (
        <div className="box-center">
            <Image src={user.photoURL || '/hacker.png'} alt="user profile" className="card-img-center" width="150" height="150" />
            {/*<img src={user.photoURL || '/hacker.png'} className="card-img-center" />*/}
            <p>
                <i>@{user.username}</i>
            </p>
            <h1>{user.displayName || 'Anonymous User'}</h1>
        </div>
    );
}
