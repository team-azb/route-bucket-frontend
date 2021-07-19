import { useState } from "react";
import { patchRename } from "../../api/routes";
import { Route } from "../../types";

type EditableNameDisplayProps = {
  routeInfo: Route;
  setRouteInfo: React.Dispatch<React.SetStateAction<Route>>;
};

type NameInputProps = {
  routeInfo: Route;
  setRouteInfo: React.Dispatch<React.SetStateAction<Route>>;
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
};

type NameDisplayProps = {
  routeInfo: Route;
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
};

function NameInput(props: NameInputProps) {
  const [nameInput, setNameInput] = useState<string>(props.routeInfo.name);

  async function onSubmitName() {
    props.setIsEditable(!props.isEditable);
    const res = await patchRename(props.routeInfo.id, {
      name: nameInput,
    });
    if (res) {
      props.setRouteInfo({ ...props.routeInfo, ...res.data });
    }
  }

  return (
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
  );
}

function NameDisplay(props: NameDisplayProps) {
  return (
    <>
      <p style={{ display: "inline" }}>ルート名: {props.routeInfo.name}</p>
      <input
        onClick={() => {
          props.setIsEditable(!props.isEditable);
        }}
        type="button"
        value="編集"
        style={{ display: "inline" }}
      />
    </>
  );
}

export default function EditableNameDisplay(props: EditableNameDisplayProps) {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  return (
    <>
      {isEditable ? (
        <NameInput
          routeInfo={props.routeInfo}
          setRouteInfo={props.setRouteInfo}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
        />
      ) : (
        <NameDisplay
          routeInfo={props.routeInfo}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
        />
      )}
    </>
  );
}
