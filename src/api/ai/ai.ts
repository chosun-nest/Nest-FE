export async function fetchChatBotAnswer(question: string): Promise<string> {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const res = await fetch(`${API_BASE_URL}/api/ai/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: question }],
      stream: false,
    }),
  });

  if (!res.ok) return "오류가 발생했습니다.";

  const data = await res.json();
  console.log("✅ 응답 데이터:", data); // <-- 여기서 응답 구조 확인

  return data.content ?? "적절한 답변을 찾지 못했습니다.";
}
