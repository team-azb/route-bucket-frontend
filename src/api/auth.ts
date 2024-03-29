import axios from "axios";
import {
  NextOrObserver,
  signOut as signOutFromFirebaseAuth,
  sendPasswordResetEmail as sendPasswordResetEmailViaFirebaseAuth,
  signInWithEmailAndPassword as signInWithEmailAndPasswordToFirebaseAuth,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  getAuth,
  User as FirebaseUser,
  sendEmailVerification as sendEmailVerificationViaFirebase,
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
  birthdate?: string;
  icon_url?: string;
  password: string;
  password_confirmation: string;
};

type CreateUserResponseBody = {
  id: string;
};

export type User = FirebaseUser;

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
  const { user } = await signInWithEmailAndPasswordToFirebaseAuth(
    auth,
    email,
    password
  );
  return user as User;
};

export const onAuthStateChanged = (callback: NextOrObserver<FirebaseUser>) => {
  const auth = getAuth();
  return onFirebaseAuthStateChanged(auth, callback);
};

export const sendEmailVerification = async (user: User) => {
  await sendEmailVerificationViaFirebase(user);
};

export const signUp = async (payload: CreateUserRequestBody) => {
  try {
    const res = await axios.post<CreateUserResponseBody>(`/users/`, payload);
    return res;
  } catch (error) {
    if (hasAxiosResponseMessage(error)) {
      throw new Error(error.response.data.message);
    }
  }
};
