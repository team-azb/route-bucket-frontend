import React from "react";
import { useParams } from "react-router-dom";

interface MypageParams {
  userId: string;
}

const Mypage = () => {
  const { userId } = useParams<MypageParams>();
  return <p>{userId}</p>;
};

export default Mypage;
