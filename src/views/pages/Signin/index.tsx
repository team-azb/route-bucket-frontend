import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { userContext } from "../../contexts/UserContextProvider";

type form = {
  email: string;
  pass: string;
};

export default function SigninPage() {
  const [form, setForm] = useState<form>({
    email: "",
    pass: "",
  });
  const user = useContext(userContext);

  const onClickSubmitHandler = async () => {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      form.email,
      form.pass
    );
    const user = userCredential.user;
    const idToken = await user.getIdToken();
    console.log(idToken);
  };

  const onClickSignoutHandler = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const onClickCreateTokenHandler = async () => {
    if (user) {
      const idToken = await user.getIdToken();
      console.log(idToken);
    }
  };

  return (
    <>
      <Link to="/signup">サインアップへ</Link>
      <h1>サインイン</h1>
      <span>email</span>
      <input
        onChange={(e) => {
          setForm((prevState) => {
            return { ...prevState, email: e.target.value };
          });
        }}
        type="email"
      />
      <br />
      <span>password</span>
      <input
        onChange={(e) => {
          setForm((prevState) => {
            return { ...prevState, pass: e.target.value };
          });
        }}
        type="password"
      />
      <br />
      <button onClick={onClickSubmitHandler}>送信</button>
      <button onClick={onClickCreateTokenHandler}>トークン生成</button>
      <button onClick={onClickSignoutHandler}>サインアウト</button>
    </>
  );
}
