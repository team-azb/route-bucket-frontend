import { useState, useEffect } from "react";
import { patchRename } from "../../api/routes";
import { Route } from "../../types";

type EditableNameDisplayProps = {
  routeInfo: Route;
  setRouteInfo: React.Dispatch<React.SetStateAction<Route>>;
};

export default function EditableNameDisplay(props: EditableNameDisplayProps) {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(props.routeInfo.name);

  useEffect(() => {
    setNameInput(props.routeInfo.name);
  }, [props.routeInfo.name]);

  async function onSubmitName() {
    setIsEditable(!isEditable);
    const res = await patchRename(props.routeInfo.id, {
      name: nameInput,
    });
    if (res) {
      props.setRouteInfo({ ...props.routeInfo, ...res.data });
    }
  }
  return (
    <>
      {isEditable ? (
        <>
          <p style={{ display: "inline" }}>
            ルート名:{" "}
            <input
              onChange={(e) => {
                setNameInput(e.target.value);
              }}
              type="text"
              value={nameInput}
            />
          </p>

          <input
            onClick={() => {
              onSubmitName();
            }}
            type="button"
            value="更新"
          />
        </>
      ) : (
        <>
          <p style={{ display: "inline" }}>ルート名: {nameInput}</p>
          <input
            onClick={() => {
              setIsEditable(!isEditable);
            }}
            type="button"
            value="編集"
            style={{ display: "inline" }}
          />
        </>
      )}
    </>
  );
}
