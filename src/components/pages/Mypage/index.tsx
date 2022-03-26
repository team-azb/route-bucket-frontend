import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import SigninRequiredTemplate from "../../organisms/SignInRequiredTemplate";
import MypageContent from "../../organisms/mypage/MypageContent";
import ProfileContent from "../../organisms/mypage/ProfileContent";
import UserInfoProvider from "../../../contexts/UserInfoProvider";
import { useAuthenticatedUserInfoContext } from "../../../contexts/AuthenticationProvider";

interface MypageParams {
  userId: string;
}

const Mypage = () => {
  const { userId } = useParams<MypageParams>();
  const { authenticatedUser } = useAuthenticatedUserInfoContext();

  const isMyOwnPage = useMemo(() => {
    return authenticatedUser ? authenticatedUser?.uid === userId : false;
  }, [authenticatedUser, userId]);

  return (
    <SigninRequiredTemplate>
      <UserInfoProvider userId={userId}>
        {isMyOwnPage ? <MypageContent /> : <ProfileContent />}
      </UserInfoProvider>
    </SigninRequiredTemplate>
  );
};

export default Mypage;
