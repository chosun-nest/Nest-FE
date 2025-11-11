/* npm install react-markdown remark-gfm 설치 필요 */

"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * 마크다운 렌더링 컴포넌트
 * @param {string} children 마크다운 문자열
 */
export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {children}
    </ReactMarkdown>
  );
}

// React.memo를 활용한 메모이즈 버전 (성능 최적화)
export const MemoizedReactMarkdown = React.memo(Markdown);
