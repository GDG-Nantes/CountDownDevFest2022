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
    GithubAuthProvider,
    signInWithPopup,
    getAuth,
    onAuthStateChanged,
} from 'firebase/auth';
import { toDataURL } from '../utilities/helpers.mjs';

const GOOGLE_PROVIDER = 1;
const GITHUB_PROVIDER = 2;

export class GlobalService {
    constructor() {
        this.db = getFirestore(firebaseApp);
        this.currentGDG = undefined;
        this.base64User = undefined;
    }

    getUser() {
        return this.user;
    }

    getCurrentGDG() {
        return this.currentGDG;
    }

    resetCurrentGDG() {
        this.currentGDG = undefined;
    }

    checkLogin(callBackUser) {
        return new Promise((resolve, reject) => {
            const fbAuth = getAuth();
            onAuthStateChanged(fbAuth, (user) => {
                if (user) {
                    this.user = user;
                    toDataURL(this.user.photoURL).then(
                        (base64User) => (this.base64User = base64User)
                    );
                    this.checkAdmin()
                        .then(() => {
                            resolve({ ...user, admin: true });
                            console.log('Admin');
                        })
                        .catch((err) => {
                            console.log('Not Admin', err);
                            resolve({ ...user, admin: false });
                        });
                } else {
                    reject();
                    console.log('userNotLogged');
                }
                //https://firebase.google.com/docs/auth/web/start
                //https://firebase.google.com/docs/firestore/quickstart
                //https://firebase.google.com/docs/auth/web/firebaseui
            });
        });
    }

    login(providerChoose) {
        return new Promise((resolve, reject) => {
            const provider =
                providerChoose === GOOGLE_PROVIDER
                    ? new GoogleAuthProvider()
                    : new GithubAuthProvider();
            const fbAuth = getAuth();
            signInWithPopup(fbAuth, provider)
                .then((result) => {
                    console.log('Post Sign in With Popup');
                    // The signed-in user info.
                    this.user = result.user;
                    toDataURL(this.user.photoURL).then(
                        (base64User) => (this.base64User = base64User)
                    );
                    this.checkAdmin()
                        .then(() => {
                            resolve({ ...result.user, admin: true });
                            console.log('Admin');
                        })
                        .catch((err) => {
                            console.log('Not Admin', err);
                            resolve({ ...result.user, admin: false });
                        });
                    // ...
                })
                .catch((error) => {
                    console.log('error login', error);
                    reject();
                });
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

    getCurrentUser() {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.db, 'travel', this.user.uid);
            getDoc(docRef).then((docTmp) => {
                let docToWrite = {
                    uid: this.user.uid,
                    photoURL: this.user.photoURL,
                    base64: this.base64User,
                    longitude: this.currentGDG.longitude,
                    latitude: this.currentGDG.latitude,
                    targetLongitude: this.currentGDG.targetLongitude,
                    finish: false,
                    name: this.user.displayName,
                    distance: 99999999,
                    days: 99999999,
                };

                if (docTmp.exists()) {
                    docToWrite.distance = Math.min(
                        docTmp.data().distance
                            ? docTmp.data().distance
                            : 99999999,
                        99999999
                    );
                    docToWrite.days = Math.min(
                        docTmp.data().days ? docTmp.data().days : 99999999,
                        99999999
                    );
                    docToWrite.finish = !!docTmp.data().finish;
                }

                resolve(docToWrite);
            });
        });
    }

    updatePosition(gdg) {
        this.currentGDG = gdg;
        return new Promise((resolve, reject) =>
            this.getCurrentUser().then((docUser) =>
                setDoc(doc(this.db, 'travel', this.user.uid), {
                    ...docUser,
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
                    })
            )
        );
    }

    finishGame(distance, days) {
        return new Promise((resolve, reject) =>
            this.getCurrentUser().then((docUser) =>
                setDoc(doc(this.db, 'travel', this.user.uid), {
                    ...docUser,
                    finish: true,
                    distance,
                    days,
                })
                    .then(() => {
                        console.log('Write new position');
                        resolve(true);
                    })
                    .catch((err) => {
                        console.log('error', err);
                        reject(err);
                    })
            )
        );
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
