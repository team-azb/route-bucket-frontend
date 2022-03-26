import React, { useCallback, useEffect, useMemo, useState } from "react";
import RouteCard from "../../RouteCard";
import { RouteInfo } from "../../../../types";
import { searchRoutes } from "../../../../api/routes";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import styles from "./style.module.css";

const PAGE_SIZE = 10;

type EditableRouteCardListProps = {
  userId: string;
};

const EditableRouteCardList = ({ userId }: EditableRouteCardListProps) => {
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageStartIdx, pageEndIdx, numberOfPages] = useMemo(() => {
    return [
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
      Math.ceil(routes.length / PAGE_SIZE),
    ];
  }, [currentPage, routes]);

  useEffect(() => {
    (async () => {
      const { routes } = await searchRoutes(userId);
      setRoutes(routes);
    })();
  }, [userId]);

  const changePageHandler = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
    },
    []
  );

  return (
    <div className={styles.container}>
      {routes.slice(pageStartIdx, pageEndIdx).map((route) => {
        return <RouteCard route={route} key={route.id} />;
      })}
      <Stack direction="row" justifyContent="center">
        <Pagination
          count={numberOfPages}
          variant="outlined"
          shape="rounded"
          page={currentPage}
          onChange={changePageHandler}
        />
      </Stack>
    </div>
  );
};

export default EditableRouteCardList;
