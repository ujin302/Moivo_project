import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const FailPage = () => {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  return (
    <div>
      <h2>결제가 실패했습니다.</h2>
      <p>에러 코드: {errorCode}</p>
      <p>에러 메시지: {errorMessage || "자세한 정보는 고객센터로 문의해주세요."}</p>
    </div>
  );
};

export default FailPage;
