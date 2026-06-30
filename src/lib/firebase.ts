// Firebase configuration for JJM 2026 Planner
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9wHSc3TM5zT65tI-qymA0VjXTWTrBJrw",
  authDomain: "jjm-growth-plan.firebaseapp.com",
  projectId: "jjm-growth-plan",
  storageBucket: "jjm-growth-plan.firebasestorage.app",
  messagingSenderId: "704358882773",
  appId: "1:704358882773:web:0827ae5ab8f1f6dccaf15c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// ─── Auth helpers ───────────────────────────────────────────────────────────
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);
export const registerWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);
export const logOut = () => signOut(auth);
export const onAuth = (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb);

// ─── Firestore helpers ───────────────────────────────────────────────────────
// All user data lives under users/{uid}/data/{key}
export async function saveToCloud(uid: string, key: string, data: unknown) {
  await setDoc(doc(db, "users", uid, "data", key), {
    value: JSON.stringify(data),
    updatedAt: Date.now(),
  });
}

export async function loadFromCloud(uid: string, key: string): Promise<unknown | null> {
  const snap = await getDoc(doc(db, "users", uid, "data", key));
  if (snap.exists()) return JSON.parse(snap.data().value);
  return null;
}

export async function loadAllFromCloud(uid: string): Promise<Record<string, unknown>> {
  const col = collection(db, "users", uid, "data");
  const snap = await getDocs(col);
  const result: Record<string, unknown> = {};
  snap.forEach((d) => {
    result[d.id] = JSON.parse(d.data().value);
  });
  return result;
}

export async function deleteFromCloud(uid: string, key: string) {
  await deleteDoc(doc(db, "users", uid, "data", key));
}
