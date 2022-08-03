import { initializeApp } from 'firebase/app';
//import 'firebase/firestore';
import { config } from './firebase-config.js';

export const firebaseApp = initializeApp(config);
