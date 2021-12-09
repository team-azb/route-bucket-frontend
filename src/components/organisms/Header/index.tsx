import React from "react";
import { Link } from "react-router-dom";
import { pagePaths } from "../../../consts/uriComponents";
import { useSignedInUserUserContext } from "../../../contexts/signedInUserContext";
import styles from "./style.module.css";

export const HEADER_HEIGHT_PX = 64;

const Header = () => {
  const signedInUser = useSignedInUserUserContext();
  return (
    <div className={styles.container} style={{ height: HEADER_HEIGHT_PX }}>
      <div className={styles.leftSection}>
        <Link className={styles.leftSectionLink} to={pagePaths.TOP}>
          Route Bucket β
        </Link>
      </div>
      <div className={styles.rightSection}>
        <Link className={styles.rightSectionLink} to={pagePaths.ROUTE_INDEX}>
          ルート検索
        </Link>
        {signedInUser ? null : (
          <Link className={styles.rightSectionLink} to={pagePaths.SIGN_IN}>
            サインイン
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
