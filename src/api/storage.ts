import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export const uploadUserIconAndGetUrl = async (userId: string, file: Blob) => {
  const userIconRef = ref(storage, `icons/${userId}.png`);
  await uploadBytes(userIconRef, file);
  return await getDownloadURL(userIconRef);
};
