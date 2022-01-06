import React from "react";
import { Link } from "react-router-dom";
import { pagePaths } from "../../../consts/uriComponents";
import { useSignedInUserInfoContext } from "../../../contexts/AuthenticationProvider";
import styles from "./style.module.css";

export const HEADER_HEIGHT_PX = 64;

const Header = () => {
  const { authenticatedUser } = useSignedInUserInfoContext();
  return (
    <div className={styles.container} style={{ height: HEADER_HEIGHT_PX }}>
      <div className={styles.leftSection}>
        <Link className={styles.leftSectionLink} to={pagePaths.top()}>
          Route Bucket β
        </Link>
      </div>
      <div className={styles.rightSection}>
        <Link className={styles.rightSectionLink} to={pagePaths.routeIndex()}>
          ルート検索
        </Link>
        {authenticatedUser ? null : (
          <Link className={styles.rightSectionLink} to={pagePaths.signIn()}>
            サインイン
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
