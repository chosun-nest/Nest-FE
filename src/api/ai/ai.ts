export async function fetchChatBotAnswer(question: string): Promise<string> {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    console.log("🤖 챗봇 요청:", { url: `${API_BASE_URL}/api/chat`, question });

    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: question,
      }),
    });

    console.log("🤖 챗봇 응답 상태:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ 챗봇 API 에러:", res.status, errorText);
      return `오류가 발생했습니다. (상태: ${res.status})`;
    }

    const data = await res.json();
    console.log("✅ 챗봇 응답 데이터:", data);

    return data.answer ?? "적절한 답변을 찾지 못했습니다.";
  } catch (error) {
    console.error("❌ 챗봇 요청 실패:", error);
    return `네트워크 오류가 발생했습니다: ${error}`;
  }
}
