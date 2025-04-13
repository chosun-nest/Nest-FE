import React from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // 만약 login 토큰이 서버를 거쳤을 때 valid 하면
  // navigate to login 할 거임
  return children;
}
