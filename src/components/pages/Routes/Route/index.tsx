import React, { useEffect, useState } from "react";
import RouteViewer from "../../RouteViewer";
import RouteEditor from "../../RouteEditor";
import { useParams } from "react-router-dom";
import { useReducerAsync } from "use-reducer-async";
import {
  routeAsyncActionHandlers,
  routeReducer,
} from "../../../../reducers/routeReducer";
import { useAuthenticationInfoContext } from "../../../../contexts/AuthenticationProvider";
import { toast } from "react-toastify";

//URLのパラメータのinerface
interface RouteEditorParams {
  routeId: string;
}

const RoutePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { routeId } = useParams<RouteEditorParams>();
  const [route, dispatchRoute] = useReducerAsync(
    routeReducer,
    {
      id: routeId,
      name: "",
      owner_id: "",
      waypoints: [],
      segments: [],
      total_distance: 0,
      elevation_gain: 0,
      isLoaded: false,
    },
    routeAsyncActionHandlers
  );
  const { authenticatedUser, getIdToken } = useAuthenticationInfoContext();

  //Mapのルート変更時にルートを取得してwaypointsを変更する
  useEffect(() => {
    (async () => {
      const token = await getIdToken();
      setIsLoading(true);
      dispatchRoute({
        type: "GET",
        id: routeId,
        token: token,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  useEffect(() => {
    //routeに変更が見られたらrouteのローディングが完了したものとし、isLoadingをfalseにする
    setIsLoading(false);
    if (route.error) {
      toast.error(route.error.message);
    }
  }, [route]);

  return (
    <>
      {authenticatedUser?.uid === route.owner_id ? (
        <RouteEditor
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          route={route}
          dispatchRoute={dispatchRoute}
        />
      ) : (
        <RouteViewer
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          route={route}
        />
      )}
    </>
  );
};

export default RoutePage;
