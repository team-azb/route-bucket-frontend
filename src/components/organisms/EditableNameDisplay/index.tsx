import { useState } from "react";
import { Route } from "../../../types";
import {
  routeReducerAction,
  routeAsyncAction,
} from "../../../reducers/routeReducer";
import "./style.css";

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
      <p style={{ display: "inline" }}>
        ルート名:{" "}
        <input
          className="editable-display__input"
          onChange={(e) => {
            setNameInput(e.target.value);
          }}
          type="text"
          value={nameInput}
        />
      </p>

      <button
        className="editable-display__btn"
        onClick={() => {
          submitNameHandler();
        }}
      >
        更新
      </button>

      <button
        className="editable-display__btn"
        onClick={() => {
          quitEditingHandler();
        }}
      >
        キャンセル
      </button>
    </>
  );
}

function NameDisplay(props: NameDisplayProps) {
  return (
    <>
      <p style={{ display: "inline" }}>ルート名: {props.route.name}</p>
      <button
        className="editable-display__btn"
        onClick={() => {
          props.setIsEditable((prevState) => {
            return !prevState;
          });
        }}
        style={{ display: "inline" }}
      >
        編集
      </button>
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
