import React from "react";
import SignUpForm from "../../organisms/signUp/SignUpForm";
import PageContainer from "../../atoms/PageContainer";
import PageTitle from "../../atoms/PageTitle";

const SignUp = () => {
  return (
    <PageContainer>
      <PageTitle title="サインアップ" />
      <SignUpForm />
    </PageContainer>
  );
};

export default SignUp;
