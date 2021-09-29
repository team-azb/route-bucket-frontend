import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

type form = {
  email: string;
  pass: string;
};

export default function SignupPage() {
  const [form, setForm] = useState<form>({
    email: "",
    pass: "",
  });

  const onClickRegisterHandler = async () => {
    const auth = getAuth();
    const credential = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.pass
    );
    console.log(credential.user);
  };
  return (
    <>
      <Link to="/signin">サインインへ</Link>
      <h1>サインアップ</h1>
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
        type="text"
      />
      <br />
      <button onClick={onClickRegisterHandler}>登録</button>
    </>
  );
}
