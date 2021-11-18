import { signOut as signOutFromFirebaseAuth, getAuth } from "firebase/auth";

export const signOut = async () => {
  const auth = getAuth();
  await signOutFromFirebaseAuth(auth);
};
