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

const RouteNew = () => {
  const [nameInput, setNameInput] = useState<string>("");
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
            const { id } = await postRoute(nameInput, token);
            toast.success("ルートを作成しました。");
            history.push(pagePaths.routeEditor(id));
          }
        } catch (error) {
          toast.success("ルートの作成に失敗しました。");
        }
      },
      [authenticatedUser, history, nameInput]
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
            <SubmitButton onClick={createRouteHandler}>作成</SubmitButton>
          </FormContainer>
        </SingleFormWrapper>
      </PageContainer>
    </SignInRequiredTemplate>
  );
};

export default RouteNew;
