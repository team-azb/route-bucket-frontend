import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import SigninRequiredTemplate from "../../organisms/SignInRequiredTemplate";
import MypageContent from "../../organisms/mypage/MypageContent";
import { useSignedInUserInfoContext } from "../../../contexts/signedInUserContext";

interface MypageParams {
  userId: string;
}

const Mypage = () => {
  const { userId } = useParams<MypageParams>();
  const { signedInUser } = useSignedInUserInfoContext();

  const isMyOwnPage = useMemo(() => {
    return signedInUser ? signedInUser?.uid === userId : false;
  }, [signedInUser, userId]);

  return (
    <SigninRequiredTemplate>
      {isMyOwnPage ? <MypageContent userId={userId} /> : <p>誰かのページ</p>}
    </SigninRequiredTemplate>
  );
};

export default Mypage;
