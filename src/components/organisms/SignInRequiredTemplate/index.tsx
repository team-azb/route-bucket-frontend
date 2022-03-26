import React, { useMemo } from "react";
import { useAuthenticatedUserInfoContext } from "../../../contexts/AuthenticationProvider";
import { Link } from "react-router-dom";
import LoadingDisplay from "../../atoms/LoadingDisplay";
import { pagePaths } from "../../../consts/uriComponents";
import styles from "./style.module.css";

type SignInRequiredTemplateProps = {
  children?: React.ReactNode;
};

const redirectMessage = (
  <div className={styles.container}>
    <p className={styles.message}>
      ページを閲覧するためにはサインインをしてください
    </p>
    <Link className={styles.anchor} to={pagePaths.signIn()}>
      サインインページはこちら
    </Link>
  </div>
);

const SignInRequiredTemplate = ({ children }: SignInRequiredTemplateProps) => {
  const { authenticatedUser, hasCheckedAuth } =
    useAuthenticatedUserInfoContext();

  const displayedContent = useMemo(() => {
    if (!hasCheckedAuth) {
      return <LoadingDisplay message="認証中です" />;
    } else if (!authenticatedUser) {
      return redirectMessage;
    } else {
      return children;
    }
  }, [hasCheckedAuth, authenticatedUser, children]);

  return <>{displayedContent}</>;
};

export default SignInRequiredTemplate;
