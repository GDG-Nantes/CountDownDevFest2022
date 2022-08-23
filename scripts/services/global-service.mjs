import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    setDoc,
    getDoc,
    onSnapshot,
    query,
} from 'firebase/firestore';
import { firebaseApp } from '../firebase/config.mjs';
import {
    GoogleAuthProvider,
    signInWithPopup,
    getAuth,
    onAuthStateChanged,
} from 'firebase/auth';

export class GlobalService {
    constructor() {
        this.db = getFirestore(firebaseApp);
    }

    getUser() {
        return this.user;
    }

    checkLogin(callBackUser) {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            callBackUser(user);
            if (user) {
                this.user = user;
                this.checkAdmin()
                    .then(() => {
                        console.log('Admin');
                    })
                    .catch((err) => console.log('Not Admin'));
            } else {
                this.login();
                console.log('userNotLogged');
            }
            //https://firebase.google.com/docs/auth/web/start
            //https://firebase.google.com/docs/firestore/quickstart
            //https://firebase.google.com/docs/auth/web/firebaseui
        });
    }

    login() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                this.user = result.user;
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential =
                    GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    checkAdmin() {
        return new Promise((resolve, reject) => {
            try {
                const docRef = doc(this.db, 'config', 'admins');
                getDoc(docRef)
                    .then((docTmp) => {
                        if (docTmp.exists()) {
                            console.log('docTmp', docTmp.data());
                        } else {
                            console.log('doc does not exists');
                        }
                        resolve(true);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    updatePosition(gdg) {
        console.log('Update position for gdg', this.user, gdg);
        return new Promise((resolve, reject) => {
            console.log(this.user);
            setDoc(doc(this.db, 'travel', this.user.uid), {
                uid: this.user.uid,
                photoURL: this.user.photoURL,
                longitude: gdg.longitude,
                latitude: gdg.latitude,
                targetLongitude: gdg.targetLongitude,
            })
                .then(() => {
                    console.log('Write new position');
                    resolve(true);
                })
                .catch((err) => {
                    console.log('error', err);
                    reject(err);
                });
        });
    }

    watchUpdatePositions(callBack) {
        const q = query(collection(this.db, 'travel'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cities = [];
            querySnapshot.forEach((doc) => {
                callBack(doc.data());
                console.log('Current data: ', doc.data());
            });
        });

        /*const unsub = onSnapshot(doc(this.db, 'travel'), (doc) => {
            console.log('Current data: ', doc.data());
        });*/
    }
}
