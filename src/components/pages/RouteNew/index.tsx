import React, { useCallback, useState } from "react";
import SignInRequiredTemplate from "../../organisms/SignInRequiredTemplate";
import PageContainer from "../../atoms/PageContainer";
import PageTitle from "../../atoms/PageTitle";
import FormContainer from "../../atoms/form/FormContainer";
import FormField from "../../atoms/form/FormField";
import SingleFormWrapper from "../../atoms/form/SingleFormWrapper";
import FormLabel from "../../atoms/form/FormLabel";
import FormInput from "../../atoms/form/FormInput";
import SubmitButton from "../../atoms/form/SubmitButton";
import styles from "./style.module.css";
import { postRoute } from "../../../api/routes";
import { useAuthenticationInfoContext } from "../../../contexts/AuthenticationProvider";
import { useHistory } from "react-router-dom";
import { pagePaths } from "../../../consts/uriComponents";
import { toast } from "react-toastify";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

type PUBLISHING_MODE = "public" | "private";

//TODO: フォルダ名も変更して呼び出し元のパスも変更する
const CreateRouteScreen = () => {
  const [nameInput, setNameInput] = useState<string>("");
  const [publishingMode, setPublishingMode] =
    useState<PUBLISHING_MODE>("public");
  const { authenticatedUser } = useAuthenticationInfoContext();
  const history = useHistory();

  const changeNameHandler: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((event) => {
      setNameInput(event.target.value);
    }, []);

  const createRouteHandler: React.MouseEventHandler<HTMLButtonElement> =
    useCallback(
      async (event) => {
        event.preventDefault();
        try {
          const token = await authenticatedUser?.getIdToken();
          if (token) {
            const { id } = await postRoute(token, {
              name: nameInput,
              is_public: publishingMode === "public",
            });
            toast.success("ルートを作成しました。");
            history.push(pagePaths.routeEditor(id));
          }
        } catch (error) {
          toast.error("ルートの作成に失敗しました。");
        }
      },
      [authenticatedUser, history, nameInput]
    );

  const changePublishingSettingHandler = useCallback(
    (event: SelectChangeEvent<string>) => {
      setPublishingMode(event.target.value as PUBLISHING_MODE);
    },
    []
  );

  return (
    <SignInRequiredTemplate>
      <PageContainer>
        <PageTitle title="ルート作成" />
        <SingleFormWrapper>
          <FormContainer>
            <h2>ルート名を入力してルートを作成します</h2>
            <FormField className={styles.formField}>
              <FormLabel htmlFor="name">ルート名</FormLabel>
              <FormInput value={nameInput} onChange={changeNameHandler} />
            </FormField>
            <FormField flexDirection="row">
              <SubmitButton
                onClick={createRouteHandler}
                className={styles.submitButton}
              >
                {publishingMode === "public"
                  ? "ルートを作成して公開する"
                  : "非公開のルートを作成する"}
              </SubmitButton>
              <Select
                id="publishing-mode-select"
                value={""}
                onChange={changePublishingSettingHandler}
                className={styles.selectRoot}
                classes={{
                  select: styles.select,
                  icon: styles.icon,
                }}
              >
                <MenuItem value="public">ルートを作成して公開する</MenuItem>
                <MenuItem value="private">非公開のルートを作成する</MenuItem>
              </Select>
            </FormField>
          </FormContainer>
        </SingleFormWrapper>
      </PageContainer>
    </SignInRequiredTemplate>
  );
};

export default CreateRouteScreen;
