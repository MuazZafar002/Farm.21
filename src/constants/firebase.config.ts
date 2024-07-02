// Import the functions you need from the SDKs you need
import {initializeApp, getApps, getApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
// @ts-expect-error TS(2305): Module '"firebase/auth"' has no exported member 'g... Remove this comment to see the full error message
import {initializeAuth, getReactNativePersistence} from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDhJxTmcOeBiLKgTJGQybWaYtGCpeAqjR8',
  authDomain: 'workouts-app-ce3b8.firebaseapp.com',
  projectId: 'workouts-app-ce3b8',
  storageBucket: 'workouts-app-ce3b8.appspot.com',
  messagingSenderId: '680461004969',
  appId: '1:680461004969:web:3acfed4f69e911f20cf9b8',
  measurementId: 'G-FQZKT2DNFZ',
}

// Initialize Firebase
let app
let auth
let db
let storage

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    storage = getStorage(app)
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    })
  } catch (err) {
    console.log('error initializing')
  }
}

app = getApp()
db = getFirestore(app)
storage = getStorage(app)

export {app, db, auth, storage}
