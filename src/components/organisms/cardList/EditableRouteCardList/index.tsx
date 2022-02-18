import React, { useEffect, useState } from "react";
import RouteCard from "../../RouteCard";
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
        return <RouteCard route={route} key={route.id} />;
      })}
    </div>
  );
};

export default EditableRouteCardList;