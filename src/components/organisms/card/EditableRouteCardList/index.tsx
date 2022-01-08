import React, { useEffect, useState } from "react";
import EditableRouteCard from "../EditableRouteCard";
import { RouteInfo } from "../../../../types";
import { searchRoutes } from "../../../../api/routes";
import styles from "./style.module.css";

type EditableRouteCardListProps = {
  userId: string;
};

const EditableRouteCardList = ({ userId }: EditableRouteCardListProps) => {
  const [routes, setRoutes] = useState<RouteInfo[]>([]);

  useEffect(() => {
    (async () => {
      const { routes } = await searchRoutes(userId);
      setRoutes(routes);
    })();
  }, [userId]);

  return (
    <div className={styles.container}>
      {routes.map((route) => {
        return <EditableRouteCard route={route} key={route.id} />;
      })}
    </div>
  );
};

export default EditableRouteCardList;
