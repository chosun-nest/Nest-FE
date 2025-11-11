import React, { useState } from "react";
import { fetchChatBotAnswer } from "../../api/ai/ai";
import { Markdown } from "./Markdown";

const FAQ_LIST = [
  "회원가입은 어떻게 하나요?",
  "비밀번호를 잊어버렸어요.",
  "회원탈퇴 하고 싶어요",
  // 원하는 FAQ 추가
];

type Chat = { role: string; content: string };

export default function ChatBotUI() {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // FAQ 버튼 클릭시
  const handleFaqClick = async (faq: string) => {
    const userMsg = { role: "user", content: faq };
    setMessages(msgs => [...msgs, userMsg]);
    setLoading(true);

    try {
      const answer = await fetchChatBotAnswer(faq); // FAQ를 직접 전달
      setMessages(msgs => [...msgs, { role: "assistant", content: answer }]);
    } catch {
      setMessages(msgs => [...msgs, { role: "assistant", content: "오류가 발생했습니다." }]);
    }
    setLoading(false);
  };

  // 기타(직접 질문) 전송
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(msgs => [...msgs, userMsg]);
    setLoading(true);

    try {
      const answer = await fetchChatBotAnswer(input); // 질문을 직접 전달
      setMessages(msgs => [...msgs, { role: "assistant", content: answer }]);
    } catch {
      setMessages(msgs => [...msgs, { role: "assistant", content: "오류가 발생했습니다." }]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div className="chatbot-ui">
      <div className="faq-menu">
        <span>무엇을 도와드릴까요?</span>
        {FAQ_LIST.map((q, i) => (
          <button key={i} onClick={() => handleFaqClick(q)} className="faq-btn">{q}</button>
        ))}
        <button onClick={() => setInput("")} className="faq-btn">기타(직접 물어보기)</button>
      </div>

      <div className="chat-history">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "msg-user" : "msg-assistant"}>
            {msg.role === "assistant" ? <Markdown>{msg.content}</Markdown> : msg.content}
          </div>
        ))}
        {loading && <div className="msg-assistant">답변 생성 중...</div>}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="직접 질문해보세요!"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>전송</button>
      </form>
    </div>
  );
}
