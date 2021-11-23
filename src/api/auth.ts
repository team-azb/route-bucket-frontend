import axios from "axios";
import {
  NextOrObserver,
  signOut as signOutFromFirebaseAuth,
  sendPasswordResetEmail as sendPasswordResetEmailViaFirebaseAuth,
  signInWithEmailAndPassword as signInWithEmailAndPasswordToFirebaseAuth,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  getAuth,
  User as FirebaseUser,
} from "firebase/auth";
import { hasAxiosResponseMessage } from "./helpers";

enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHERS = "others",
}

export type CreateUserRequestBody = {
  id: string;
  name: string;
  email: string;
  gender?: Gender;
  birthdate?: Date;
  icon_url?: string;
  password: string;
  password_confirmation: string;
};

type CreateUserResponseBody = {
  id: string;
};

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

export const signUp = async (payload: CreateUserRequestBody) => {
  let res;
  try {
    res = await axios.post<CreateUserResponseBody>(`/users/`, payload);
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      console.error(error.response.data.message);
    }
  }
  return res;
};
