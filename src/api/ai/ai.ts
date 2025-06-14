export async function fetchOpenAIStream({
  messages,
  onMessage,
}: {
  messages: { role: string; content: string }[];
  onMessage: (content: string) => void;
}) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // 또는 gpt-4o
      stream: true,
      temperature: 0.7,
      messages,
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error("OpenAI API 요청 실패");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1); // 이후 부분은 다음 루프에서 사용

      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice("data: ".length).trim();
      if (jsonStr === "[DONE]") return;

      try {
        const parsed = JSON.parse(jsonStr);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) onMessage(delta);
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }
  }
}
