import { initializeApp } from 'firebase/app';
//import 'firebase/firestore';
import { config } from './firebase-config.mjs';

export const firebaseApp = initializeApp(config);
