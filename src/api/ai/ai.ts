export async function fetchChatBotAnswer(question: string): Promise<string> {
  // nginx 프록시를 통한 상대 경로 사용
  const API_URL = "/api/chat";

  try {
    console.log("🤖 챗봇 요청:", { url: API_URL, question });

    const res = await fetch(API_URL, {
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
