import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRoutes, deleteRoute } from "../../../api/routes";
import { Route } from "../../../types";
import SignInRequiredTemplate from "../../organisms/SignInRequiredTemplate";
import { pagePaths } from "../../../consts/uriComponents";

function RouteIndex() {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      const res = await getRoutes();
      if (res && !unmounted) {
        setRoutes(res.data.routes);
      }
    })();
    return () => {
      unmounted = true;
    };
  }, []);

  async function deleteRouteHandler(id: string) {
    try {
      await deleteRoute(id);
      const getRes = await getRoutes();
      if (getRes) {
        setRoutes(getRes.data.routes);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const Routes = () => {
    const RouteList = routes.map((route) => {
      return (
        <li key={route.id}>
          <h3>{route.name}</h3>
          <Link to={pagePaths.routeEditor(route.id)}>
            <button>ルートを編集</button>
          </Link>
          <button
            onClick={() => {
              deleteRouteHandler(route.id);
            }}
          >
            ルートを削除
          </button>
          <hr />
        </li>
      );
    });
    return <ul>{RouteList}</ul>;
  };

  return (
    <SignInRequiredTemplate>
      <div>
        <h2>ルートの一覧</h2>
        <Routes />
      </div>
    </SignInRequiredTemplate>
  );
}

export default RouteIndex;
