/*  npm install react-spinners 설치 필요 */

"use client";

import { useState, CSSProperties, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { MemoizedReactMarkdown } from "../chatbot/Markdown";
import ScaleLoader from "react-spinners/ScaleLoader";
import { fetchChatBotAnswer } from "../../api/ai/ai";
import { selectCurrentUserName } from "../../store/slices/userSlice";
import { selectIsLoggedIn } from "../../store/slices/authSlice";

const ai = "/assets/images/ai.png";
const ai_hover = "/assets/images/ai_hover.png";

type Chat = {
  role: "user" | "assistant";
  content: string;
  userName?: string; // 사용자 이름 저장용
};

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  height: "20px",
};

const FAQ_LIST = [
  "이 사이트에 대해서 설명해주세요.",
  "프로젝트 모집/지원 방법이 궁금해요",
  "게시글은 어떻게 작성하나요?",
  "내 프로필은 어떻게 수정하나요?",
  "비밀번호를 잊어버렸어요",
];

export default function Ai() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isFirstMessage, setIsFirstMessage] = useState(true); // 첫 메시지 여부
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>(FAQ_LIST); // 추천 질문 목록
  const [color] = useState("#ffffff");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Redux에서 사용자 정보 가져오기
  const memberName = useSelector(selectCurrentUserName);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // 입력란 자동 스크롤
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, loading, isOpen]);

  // 챗봇 오픈 시 초기 인사 메시지 추가
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const userName = isLoggedIn && memberName ? `${memberName}님` : "비회원님";

      // 로그인 사용자는 예시 포함, 비회원은 기본 인사만
      const welcomeContent = isLoggedIn && memberName
        ? `반갑습니다 ${userName}! 무엇을 도와드릴까요?

**예시:**
- 마일리지 관련 공지사항 검색해줘.
- Python 관련 게시물 추천해줘.
- AI 관련 프로젝트 추천해줘.`
        : `반갑습니다 ${userName}! 무엇을 도와드릴까요?`;

      const welcomeMessage: Chat = {
        role: "assistant",
        content: welcomeContent,
      };
      setMessages([welcomeMessage]);
      setIsFirstMessage(true); // 첫 메시지 상태
      setRecommendedQuestions(FAQ_LIST); // 초기 FAQ 설정
    }
  }, [isOpen, isLoggedIn, memberName, messages.length]);

  // input 오토포커싱
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, loading, messages]); // loading이나 messages 변경 후에도 포커싱

  async function handleFaqClick(faq: string) {
    if (isFirstMessage && isLoggedIn) {
      setIsFirstMessage(false); // 첫 메시지 이후
      // TODO: 백엔드에서 RAG 시스템으로 연관 질문을 받아오면 여기서 업데이트
      // 예시: setRecommendedQuestions(response.relatedQuestions);
      // 임시로 테스트용 질문 3개 표시 (로그인 사용자만)
      setRecommendedQuestions(["임시질문1", "임시질문2", "임시질문3"]);
    }
    setLoading(true);
    const userMessage: Chat = {
      role: "user",
      content: faq,
      userName: isLoggedIn && memberName ? `${memberName}님` : "비회원님",
    };
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
    if (!question.trim() || !isLoggedIn) return; // 비회원은 자유 질문 불가
    if (isFirstMessage && isLoggedIn) {
      setIsFirstMessage(false); // 첫 메시지 이후
      // TODO: 백엔드에서 RAG 시스템으로 연관 질문을 받아오면 여기서 업데이트
      // 예시: setRecommendedQuestions(response.relatedQuestions);
      // 임시로 테스트용 질문 3개 표시 (로그인 사용자만)
      setRecommendedQuestions(["임시질문1", "임시질문2", "임시질문3"]);
    }
    setLoading(true);
    const userMessage: Chat = {
      role: "user",
      content: question,
      userName: isLoggedIn && memberName ? `${memberName}님` : "비회원님",
    };
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
          <div className="overflow-y-auto flex-grow pr-1 space-y-3 custom-scroll transition-all duration-300 ease-in-out">
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              // userName이 저장되어 있으면 사용, 없으면 현재 Redux 상태 확인
              const displayName = isUser
                ? (message.userName || (isLoggedIn && memberName ? `${memberName}님` : "비회원님"))
                : "위닛";
              const bgColor = isUser ? "#e0f7ff" : "#007acc";
              const textColor = isUser ? "#000000" : "#ffffff";
              const avatarSrc = isUser
                ? "/assets/images/chick.png"
                : "/assets/images/ai.png";

              return (
                <div
                  key={index}
                  className="flex flex-col border-t border-gray-200 dark:border-gray-700 pt-3"
                >
                  {/* 상단: 아이콘과 이름 */}
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                      {displayName}
                    </span>
                  </div>
                  {/* 하단: 메시지 박스 */}
                  <div
                    className="px-3 py-2 rounded-2xl shadow-sm"
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                    }}
                  >
                    <MemoizedReactMarkdown key={index} isAssistant={!isUser}>
                      {message.content}
                    </MemoizedReactMarkdown>
                  </div>
                </div>
              );
            })}
            {loading && <div className="text-sm text-gray-500 dark:text-gray-400 pl-2">답변 생성 중...</div>}
            <div ref={chatEndRef} />
          </div>

          {/* 추천 질문 (FAQ 또는 연관 질문) */}
          {recommendedQuestions.length > 0 && (
            <div className="flex flex-col gap-2 mt-3 mb-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 px-1 mb-1">
                {isFirstMessage ? "자주 묻는 질문" : "추천 질문"}
              </div>
              {isFirstMessage ? (
                // 첫 메시지: 세로 스택
                recommendedQuestions.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFaqClick(faq)}
                    disabled={loading}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    {faq}
                  </button>
                ))
              ) : (
                // 첫 메시지 이후: 가로 스크롤
                <div
                  className="flex gap-2 overflow-x-auto pb-2"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#CBD5E0 transparent',
                  }}
                >
                  {recommendedQuestions.map((faq, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleFaqClick(faq)}
                      disabled={loading}
                      className="flex-shrink-0 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {faq}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 입력창 */}
          <div className="flex items-center gap-2 w-full mt-2">
            <input
              ref={inputRef}
              className="flex-grow px-3 py-2 text-sm shadow-sm rounded-md ring-gray-300 dark:ring-gray-700 ring-1 ring-inset disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
              placeholder={isLoggedIn ? "질문을 입력해주세요." : "로그인 후 자유질문 입력이 가능합니다"}
              onChange={handleQuestion}
              value={question}
              disabled={loading || !isLoggedIn}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isLoggedIn) postChatAPI();
              }}
            />
            <button
              className="w-16 bg-indigo-600 hover:bg-indigo-700 px-3 py-2 text-sm font-semibold text-white shadow-sm rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
              onClick={postChatAPI}
              disabled={!question.trim() || loading || !isLoggedIn}
            >
              {loading ? (
                <ScaleLoader
                  color={color}
                  loading={loading}
                  cssOverride={override}
                  height={15}
                  aria-label="Loading Spinner"
                />
              ) : (
                "전송"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
