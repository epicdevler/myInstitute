// Import the functions you need from the SDKs you need

import { initializeApp, getApp, FirebaseAppError} from "firebase-admin/app";
import {initializeFirestore } from "firebase-admin/firestore"
import {getAuth  } from "firebase-admin/auth"
import {credential  } from "firebase-admin"

const cert = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!)

// Initialize Firebase
const initApp = () => {
    try{
        return getApp()
    }catch(e){
        if(e instanceof FirebaseAppError){
            return initializeApp({credential: credential.cert(cert)})
        }else{
            throw e
        }
    }
}

const app = initApp()

// persistentMultipleTabManager()

export const firebaseAuthAdmin = getAuth(app);

export const firestoreDBAdmin= initializeFirestore(app);

