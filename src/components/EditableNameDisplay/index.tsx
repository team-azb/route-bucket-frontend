import { useState } from "react";
import { patchRename } from "../../api/routes";
import { Route } from "../../types";

type EditableNameDisplayProps = {
  route: Route;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
};

type NameInputProps = {
  route: Route;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
};

type NameDisplayProps = {
  route: Route;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
};

function NameInput(props: NameInputProps) {
  const [nameInput, setNameInput] = useState<string>(props.route.name);

  async function onSubmitName() {
    props.setIsEditable((prevState) => {
      return !prevState;
    });
    const res = await patchRename(props.route.id, {
      name: nameInput,
    });
    if (res) {
      props.setRoute((prevState) => {
        return { ...prevState, ...res.data };
      });
    }
  }

  function onQuitEditing() {
    props.setIsEditable((prevState) => {
      return !prevState;
    });
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

      <input
        onClick={() => {
          onQuitEditing();
        }}
        type="button"
        value="キャンセル"
      />
    </>
  );
}

function NameDisplay(props: NameDisplayProps) {
  return (
    <>
      <p style={{ display: "inline" }}>ルート名: {props.route.name}</p>
      <input
        onClick={() => {
          props.setIsEditable((prevState) => {
            return !prevState;
          });
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
          route={props.route}
          setRoute={props.setRoute}
          setIsEditable={setIsEditable}
        />
      ) : (
        <NameDisplay route={props.route} setIsEditable={setIsEditable} />
      )}
    </>
  );
}
