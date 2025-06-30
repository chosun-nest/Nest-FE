/*  npm install react-spinners 설치 필요 */

"use client";

import { useState, CSSProperties, useRef, useEffect } from "react";
import { MemoizedReactMarkdown } from "../chatbot/Markdown";
import ScaleLoader from "react-spinners/ScaleLoader";
import { fetchChatBotAnswer } from "../../api/ai/ai";

const ai = "/assets/images/ai.png";
const ai_hover = "/assets/images/ai_hover.png";

type Chat = { role: "user" | "assistant"; content: string };

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  height: "20px",
};

const FAQ_LIST = [
  "회원가입은 어떻게 하나요?",
  "비밀번호를 잊어버렸어요.",
  "회원탈퇴 하고 싶어요",
  // 필요시 추가
];

type FooterStep = "main" | "faq" | "direct";

export default function Ai() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [footerStep, setFooterStep] = useState<FooterStep>("main");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [color] = useState("#ffffff");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 입력란 자동 스크롤
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, loading, isOpen]);

  async function handleFaqClick(faq: string) {
    setLoading(true);
    const userMessage: Chat = { role: "user", content: faq };
    setMessages((prev) => [...prev, userMessage]);
    try {
      const answer = await fetchChatBotAnswer(faq);
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "오류가 발생했습니다." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function postChatAPI() {
    if (!question.trim()) return;
    setLoading(true);
    const userMessage: Chat = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    try {
      const answer = await fetchChatBotAnswer(question);
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "오류가 발생했습니다." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleQuestion(e: React.ChangeEvent<HTMLInputElement>) {
    setQuestion(e.target.value);
  }

  function closeAndReset() {
    setIsOpen(false);
    setFooterStep("main");
    setQuestion("");
    setLoading(false);
    // setMessages([]); // 필요에 따라 대화 초기화
  }

  // footer 렌더
  function renderFooter() {
    if (footerStep === "main") {
      return (
        <div className="flex gap-2 w-full">
          <button
            className="flex-1 bg-blue-100 text-blue-800 py-2 rounded font-medium"
            onClick={() => setFooterStep("faq")}
            disabled={loading}
          >
            FAQ 질문보기
          </button>
          <button
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded font-medium"
            onClick={() => setFooterStep("direct")}
            disabled={loading}
          >
            직접 질문하기
          </button>
        </div>
      );
    }
    if (footerStep === "faq") {
      return (
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-row items-center mb-2">
            <button
              className="text-xs text-blue-700 mr-2"
              onClick={() => setFooterStep("main")}
              disabled={loading}
              style={{ background: "none", border: "none" }}
            >
              ←
            </button>
            <span className="font-semibold text-sm text-gray-700">
              FAQ를 선택해 주세요
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {FAQ_LIST.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => handleFaqClick(faq)}
                disabled={loading}
                className="flex-1 bg-blue-100 text-blue-800 py-1 px-2 rounded text-xs"
              >
                {faq}
              </button>
            ))}
          </div>
          <button
            className="bg-gray-100 text-gray-700 py-1 rounded font-medium"
            onClick={() => setFooterStep("direct")}
            disabled={loading}
          >
            원하는 질문이 없어요 (직접 질문)
          </button>
        </div>
      );
    }
    if (footerStep === "direct") {
      return (
        <div className="flex items-center gap-2 w-full">
          <button
            className="text-xs text-blue-700"
            onClick={() => setFooterStep("main")}
            disabled={loading}
            style={{ background: "none", border: "none" }}
          >
            ←
          </button>
          <input
            className="flex-grow px-3 py-2 text-sm shadow-sm rounded-md ring-gray-300 dark:ring-gray-700 ring-1 ring-inset disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-black dark:text-white"
            placeholder="질문을 입력해주세요."
            onChange={handleQuestion}
            value={question}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") postChatAPI();
            }}
          />
          <button
            className="w-20 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
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
      );
    }
  }

  return (
    <>
      {/* 툴팁 - 챗봇 아이콘 위에 고정 */}
      {showTooltip && !isOpen && (
        <div
          className="fixed right-[55px] bottom-[90px] bg-white border rounded-xl shadow-lg p-3 text-gray-800 text-sm z-50"
          style={{
            minWidth: "180px",
            maxWidth: "230px",
            lineHeight: "1.5",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>
              궁금하신게 있으신가요?
              <br />
              위닛에게 물어보세요!{" "}
              <span role="img" aria-label="smile">
                😊
              </span>
            </span>
            <button
              onClick={() => setShowTooltip(false)}
              style={{
                marginLeft: "8px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                color: "#999",
              }}
              aria-label="툴팁 닫기"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* AI 도우미 버튼 */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          setFooterStep("main");
          setShowTooltip(false);
        }}
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
        <div className="fixed right-6 bottom-[calc(3rem+50px+8px)] w-[350px] h-[540px] bg-white dark:bg-gray-900 rounded-xl p-4 shadow-xl z-50 flex flex-col">
          {/* 상단 */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">
              AI 도우미 위닛(WitN)
            </h2>
          </div>
          {/* 채팅 히스토리 */}
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
                    {displayName === "위닛" ? (
                      <img src="/assets/images/ai.png" />
                    ) : (
                      <img src="/assets/images/chick.png" />
                    )}
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
            {loading && <div className="msg-assistant">답변 생성 중...</div>}
            <div ref={chatEndRef} />
          </div>
          {/* 하단(footer): 메뉴 or 입력창 등 */}
          <div className="mt-2">{renderFooter()}</div>
        </div>
      )}
    </>
  );
}
