import { useState, useEffect } from "react";
import { patchRename } from "../../api/routes";

type EditableNameDisplayProps = {
  routeName: string;
  routeId: string;
  setRouteName: React.Dispatch<React.SetStateAction<string>>;
};

export default function EditableNameDisplay(props: EditableNameDisplayProps) {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(props.routeName);

  useEffect(() => {
    setNameInput(props.routeName);
  }, [props.routeName]);

  async function onSubmitName() {
    setIsEditable(!isEditable);
    const res = await patchRename(props.routeId, {
      name: nameInput,
    });
    if (res) {
      props.setRouteName(res.data.name);
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
