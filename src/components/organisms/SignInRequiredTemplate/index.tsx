import React, { useMemo } from "react";
import { useSignedInUserInfoContext } from "../../../contexts/AuthenticationProvider";
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
  const { authenticatedUser, isCheckedAuth } = useSignedInUserInfoContext();

  const displayedContent = useMemo(() => {
    if (!isCheckedAuth) {
      return <LoadingDisplay message="認証中です" />;
    } else if (!authenticatedUser) {
      return redirectMessage;
    } else {
      return children;
    }
  }, [isCheckedAuth, authenticatedUser, children]);

  return <>{displayedContent}</>;
};

export default SignInRequiredTemplate;
