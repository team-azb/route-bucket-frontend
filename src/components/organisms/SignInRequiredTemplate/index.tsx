import React, { useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { useSignedInUserInfoContext } from "../../../contexts/signedInUserContext";
import { Link } from "react-router-dom";
import { pagePaths } from "../../../consts/uriComponents";
import styles from "./style.module.css";

const redirectMessage = (
  <div className={styles.container}>
    <p className={styles.message}>
      ページを閲覧するためにはサインインをしてください
    </p>
    <Link className={styles.anchor} to={pagePaths.SIGN_IN}>
      サインインページはこちら
    </Link>
  </div>
);

const loadingDisplay = (
  <div className={styles.container}>
    <p className={styles.message}>認証中です</p>
    <CircularProgress />
  </div>
);

const SignInRequiredTemplate: React.FC = ({ children }) => {
  const { signedInUser, hasCheckedAuth } = useSignedInUserInfoContext();

  const displayedContent = useMemo(() => {
    if (!hasCheckedAuth) {
      return loadingDisplay;
    } else if (!signedInUser) {
      return redirectMessage;
    } else {
      return children;
    }
  }, [hasCheckedAuth, signedInUser, children]);

  return <>{displayedContent}</>;
};

export default SignInRequiredTemplate;
