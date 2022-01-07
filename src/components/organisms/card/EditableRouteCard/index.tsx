import React from "react";
import { RouteInfo } from "../../../../types";
import styles from "./style.module.css";

type EditableRouteCardProps = {
  route: RouteInfo;
};

const EditableRouteCard = ({ route }: EditableRouteCardProps) => {
  return <div className={styles.container}>{route.name}</div>;
};

export default EditableRouteCard;
