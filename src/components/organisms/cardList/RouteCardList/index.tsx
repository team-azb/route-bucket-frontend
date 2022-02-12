import React, { useEffect, useState } from "react";
import { searchRoutes } from "../../../../api/routes";
import { RouteInfo } from "../../../../types";
import RouteCard from "../../RouteCard";
import styles from "./style.module.css";

type EouteCardListProps = {
  userId: string;
};

const EouteCardList = ({ userId }: EouteCardListProps) => {
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

export default EouteCardList;
