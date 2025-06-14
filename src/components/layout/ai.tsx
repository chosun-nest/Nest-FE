"use client";

import { useState, CSSProperties } from "react";
import { MemoizedReactMarkdown } from "../ai/Markdown";
import ScaleLoader from "react-spinners/ScaleLoader";
import { fetchOpenAIStream } from "../../api/ai/ai";

const ai = "/assets/images/ai.png";
const ai_hover = "/assets/images/ai_hover.png";

type Chat = {
  role: "user" | "assistant";
  content: string;
};

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  height: "20px",
};

export default function Ai() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [color] = useState("#ffffff");

  function handleQuestion(e: React.ChangeEvent<HTMLInputElement>) {
    setQuestion(e.target.value);
  }

  async function postChatAPI() {
    setLoading(true);

    const userMessage: Chat = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");

    try {
      await fetchOpenAIStream({
        messages: [...messages, userMessage],
        onMessage: (chunk: string) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { role: "assistant", content: last.content + chunk },
              ];
            } else {
              return [...prev, { role: "assistant", content: chunk }];
            }
          });
        },
      });
    } catch (e) {
      console.error("OpenAI API 오류", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* AI 도우미 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 w-[50px] h-[50px] bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition duration-300 z-50"
        aria-label="AI 도우미 열기"
      >
        <img
          src={isHovered ? ai_hover : ai}
          alt="AI 도우미"
          className="w-7 h-7"
        />
      </button>

      {/* 챗봇 모달 */}
      {isOpen && (
        <div className="fixed right-6 bottom-[calc(3rem+50px+8px)] w-[350px] h-[500px] bg-white dark:bg-gray-900 rounded-xl p-4 shadow-xl z-50 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">
              AI 도우미 위닛(WitN)
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
              aria-label="닫기"
            >
              ✖️
            </button>
          </div>

          <div className="flex mb-2">
            <input
              className="px-3 py-2 text-sm shadow-sm rounded-md flex-grow ring-gray-300 dark:ring-gray-700 ring-1 ring-inset disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-black dark:text-white"
              placeholder="질문을 입력해주세요."
              onChange={handleQuestion}
              value={question}
              disabled={loading}
            />
            <button
              className="w-20 ml-1 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
              onClick={postChatAPI}
              disabled={!question || loading}
            >
              <ScaleLoader
                color={color}
                loading={loading}
                cssOverride={override}
                height={15}
                aria-label="Loading Spinner"
              />
              {!loading && "질문"}
            </button>
          </div>

          <div className="overflow-y-auto flex-grow pr-1 space-y-2 custom-scroll transition-all duration-300 ease-in-out">
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              const displayName = isUser ? "me" : "위닛";
              const bgColor = isUser ? "#e0f7ff" : "#007acc";
              const textColor = isUser ? "#000000" : "#ffffff";

              return (
                <div
                  key={index}
                  className="flex border-t border-gray-200 dark:border-gray-700 pt-3"
                >
                  <p className="w-1/6 py-2 px-2 font-semibold text-sm text-gray-600 dark:text-gray-300">
                    {displayName}
                  </p>
                  <div
                    className="w-5/6 px-3 py-2 rounded-2xl shadow-sm"
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <MemoizedReactMarkdown key={index}>
                      {message.content}
                    </MemoizedReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
