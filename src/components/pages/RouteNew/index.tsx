import React from "react";
import SignInRequiredTemplate from "../../organisms/SignInRequiredTemplate";
import PageContainer from "../../atoms/PageContainer";
import PageTitle from "../../atoms/PageTitle";
import FormContainer from "../../atoms/form/FormContainer";
import FormField from "../../atoms/form/FormField";
import SingleFormWrapper from "../../atoms/form/SingleFormWrapper";
import FormLabel from "../../atoms/form/FormLabel";

const RouteNew = () => {
  return (
    <SignInRequiredTemplate>
      <PageContainer>
        <PageTitle title="ルート作成" />
        <SingleFormWrapper>
          <FormContainer>
            <h2>ルート名を入力してルートを作成します</h2>
            <FormField>
              <FormLabel htmlFor="name">ルート名</FormLabel>
            </FormField>
          </FormContainer>
        </SingleFormWrapper>
      </PageContainer>
    </SignInRequiredTemplate>
  );
};

export default RouteNew;
