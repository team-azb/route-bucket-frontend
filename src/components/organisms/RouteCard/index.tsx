import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { dynamicPathGenerator } from "../../../consts/uriComponents";
import { RouteInfo } from "../../../types";
import styles from "./style.module.css";

type RouteCardProps = {
  route: RouteInfo;
};

const RouteCard = ({ route }: RouteCardProps) => {
  const history = useHistory();
  const moveToEditPageHandler = useCallback(() => {
    history.push(dynamicPathGenerator.routeEditor(route.id));
  }, [history, route.id]);

  return (
    <div className={styles.container} onClick={moveToEditPageHandler}>
      <div className={styles.imageContainer}></div>
      <div className={styles.infoContainer}>
        <div className={styles.header}>
          <h2 className={styles.name}>{route.name}</h2>
          <p className={styles.update}>最終更新日時: 2021.10.31 15:06</p>
        </div>
        <hr />
        <p className={styles.info}>総距離: 6.5km</p>
        <p className={styles.info}>獲得標高: 500m (Up: 550m /Down: 50m)</p>
      </div>
    </div>
  );
};

export default RouteCard;
