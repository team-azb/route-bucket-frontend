import {
  NextOrObserver,
  signOut as signOutFromFirebaseAuth,
  sendPasswordResetEmail as sendPasswordResetEmailViaFirebaseAuth,
  signInWithEmailAndPassword as signInWithEmailAndPasswordToFirebaseAuth,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  getAuth,
  User as FirebaseUser,
} from "firebase/auth";

export interface User extends FirebaseUser {}

export const signOut = async () => {
  const auth = getAuth();
  await signOutFromFirebaseAuth(auth);
};

export const sendPasswordResetEmail = async (email: string) => {
  const auth = getAuth();
  await sendPasswordResetEmailViaFirebaseAuth(auth, email);
};

export const signInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const auth = getAuth();
  await signInWithEmailAndPasswordToFirebaseAuth(auth, email, password);
};

export const onAuthStateChanged = (callback: NextOrObserver<FirebaseUser>) => {
  const auth = getAuth();
  return onFirebaseAuthStateChanged(auth, callback);
};
