import { useState } from "react";
import { Button } from "@mui/material";
import { Route } from "../../../types";
import {
  routeReducerAction,
  routeAsyncAction,
} from "../../../reducers/routeReducer";
import { Typography } from "@mui/material";

type EditableNameDisplayProps = {
  route: Route;
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
};

type NameInputProps = {
  route: Route;
  dispatchRoute: React.Dispatch<routeReducerAction | routeAsyncAction>;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
};

type NameDisplayProps = {
  route: Route;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
};

function NameInput(props: NameInputProps) {
  const [nameInput, setNameInput] = useState<string>(props.route.name);

  function submitNameHandler() {
    props.setIsEditable((prevState) => {
      return !prevState;
    });
    props.dispatchRoute({ type: "RENAME", name: nameInput });
  }

  function quitEditingHandler() {
    props.setIsEditable((prevState) => {
      return !prevState;
    });
  }

  return (
    <>
      <Typography style={{ display: "inline" }}>
        ルート名:{" "}
        <input
          onChange={(e) => {
            setNameInput(e.target.value);
          }}
          type="text"
          value={nameInput}
        />
      </Typography>

      <Button
        onClick={() => {
          submitNameHandler();
        }}
      >
        更新
      </Button>

      <Button
        onClick={() => {
          quitEditingHandler();
        }}
      >
        キャンセル
      </Button>
    </>
  );
}

function NameDisplay(props: NameDisplayProps) {
  return (
    <>
      <Typography style={{ display: "inline" }}>
        ルート名: {props.route.name}
      </Typography>
      <Button
        onClick={() => {
          props.setIsEditable((prevState) => {
            return !prevState;
          });
        }}
        style={{ display: "inline" }}
      >
        編集
      </Button>
    </>
  );
}

export default function EditableNameDisplay(props: EditableNameDisplayProps) {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  return (
    <>
      {isEditable ? (
        <NameInput
          route={props.route}
          dispatchRoute={props.dispatchRoute}
          setIsEditable={setIsEditable}
        />
      ) : (
        <NameDisplay route={props.route} setIsEditable={setIsEditable} />
      )}
    </>
  );
}
