import React, { useMemo } from "react";
import { useSignedInUserInfoContext } from "../../../contexts/signedInUserContext";
import { Link } from "react-router-dom";
import LoadingDisplay from "../../atoms/LoadingDisplay";
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

// const loadingDisplay = (
//   <div className={styles.container}>
//     <p className={styles.message}>認証中です</p>
//     <CircularProgress />
//   </div>
// );

const SignInRequiredTemplate: React.FC = ({ children }) => {
  const { signedInUser, isCheckedAuth } = useSignedInUserInfoContext();

  const displayedContent = useMemo(() => {
    if (!isCheckedAuth) {
      return <LoadingDisplay message="認証中です" />;
    } else if (!signedInUser) {
      return redirectMessage;
    } else {
      return children;
    }
  }, [isCheckedAuth, signedInUser, children]);

  return <>{displayedContent}</>;
};

export default SignInRequiredTemplate;
