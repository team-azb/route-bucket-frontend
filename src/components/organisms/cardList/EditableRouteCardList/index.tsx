import React, { useCallback, useEffect, useState } from "react";
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
  const [numberOfPages, setNumberOfPages] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const { routes, result_num } = await searchRoutes({
        ownerId: userId,
        pageOffset: currentPage - 1,
        pageSize: PAGE_SIZE,
      });
      setRoutes(routes);
      setNumberOfPages(Math.ceil(result_num / PAGE_SIZE));
    })();
  }, [userId, currentPage]);

  const changePageHandler = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
    },
    []
  );

  return (
    <div className={styles.container}>
      {routes.map((route) => {
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
