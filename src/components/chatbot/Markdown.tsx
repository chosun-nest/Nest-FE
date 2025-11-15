/* npm install react-markdown remark-gfm 설치 필요 */

"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * 마크다운 렌더링 컴포넌트
 * @param {string} children 마크다운 문자열
 * @param {boolean} isAssistant 어시스턴트 메시지 여부 (링크 색상 조정용)
 */
export function Markdown({ children, isAssistant = false }: { children: string; isAssistant?: boolean }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 제목
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mb-1 mt-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-bold mb-1 mt-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-bold mb-1 mt-1" {...props} />
          ),
          // 리스트
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-1 ml-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-1 ml-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-0.5" {...props} />
          ),
          // 인라인 코드
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code
                className={
                  isAssistant
                    ? "bg-blue-800 bg-opacity-50 px-1 py-0.5 rounded text-sm font-mono"
                    : "bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono"
                }
                {...props}
              />
            ) : (
              <code
                className={
                  isAssistant
                    ? "block bg-blue-800 bg-opacity-50 p-2 rounded text-sm font-mono overflow-x-auto mb-1"
                    : "block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono overflow-x-auto mb-1"
                }
                {...props}
              />
            ),
          // 코드 블록
          pre: ({ node, ...props }) => (
            <pre
              className={
                isAssistant
                  ? "bg-blue-800 bg-opacity-50 p-2 rounded overflow-x-auto mb-1"
                  : "bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto mb-1"
              }
              {...props}
            />
          ),
          // 강조
          strong: ({ node, ...props }) => (
            <strong className="font-bold" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic" {...props} />
          ),
          // 링크
          a: ({ node, ...props }) => (
            <a
              className={
                isAssistant
                  ? "text-yellow-300 hover:text-yellow-100 underline font-semibold"
                  : "text-blue-600 hover:text-blue-800 underline"
              }
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          // 단락
          p: ({ node, ...props }) => (
            <p className="mb-1 last:mb-0" {...props} />
          ),
          // 인용구
          blockquote: ({ node, ...props }) => (
            <blockquote
              className={
                isAssistant
                  ? "border-l-4 border-blue-300 pl-4 italic my-1"
                  : "border-l-4 border-gray-300 pl-4 italic my-1"
              }
              {...props}
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

// React.memo를 활용한 메모이즈 버전 (성능 최적화)
export const MemoizedReactMarkdown = React.memo(Markdown, (prevProps, nextProps) => {
  return prevProps.children === nextProps.children && prevProps.isAssistant === nextProps.isAssistant;
});
