import { useState, CSSProperties } from "react";
import { MemoizedReactMarkdown } from "./shared/Markdown";
import ScaleLoader from "react-spinners/ScaleLoader";

type Chat = {
  role: "user" | "assistant";
  content: string;
};

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  height: "20px",
};

export default function ChatBotUI() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  const handleQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const postChatAPI = () => {
    setLoading(true);
    (async () => {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            ...messages,
            {
              role: "user",
              content: question,
            },
          ],
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let content = "";
      if (!reader) return;

      while (true) {
        setQuestion("");
        setLoading(false);
        const { done, value } = await reader.read();
        if (done) break;
        const decodedValue = decoder.decode(value);
        content += decodedValue;
        setMessages([
          ...messages,
          { role: "user", content: question },
          { role: "assistant", content: content },
        ]);
      }
    })();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto space-y-3 mb-2">
        {messages.map((message, index) => {
          const isUser = message.role === "user";
          const bgColor = isUser ? "#e0f7ff" : "#007acc";
          const textColor = isUser ? "#000000" : "#ffffff";
          const displayName = isUser ? "me" : "위닛";
          return (
            <div key={index} className="flex">
              <p className="w-1/6 text-xs pt-1">{displayName}</p>
              <div
                className="w-5/6 px-3 py-2 rounded-2xl shadow-md"
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                <MemoizedReactMarkdown>{message.content}</MemoizedReactMarkdown>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex mt-auto pt-2">
        <input
          type="text"
          className="px-2 py-1 border rounded flex-grow text-sm"
          placeholder="질문을 입력하세요"
          onChange={handleQuestion}
          value={question}
          disabled={loading}
        />
        <button
          onClick={postChatAPI}
          disabled={!question || loading}
          className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded text-sm disabled:bg-gray-300"
        >
          <ScaleLoader
            color="#fff"
            loading={loading}
            cssOverride={override}
            height={10}
            aria-label="Loading Spinner"
          />
          {!loading && "질문"}
        </button>
      </div>
    </div>
  );
}
