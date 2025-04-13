//Nest-FE-dev\src\routes\notice-board.tsx
// ✅ 수정된 src/pages/NoticeBoard.tsx 전체 코드
import { useEffect, useState } from "react";
import API from "../api";

type Notice = {
  number: string;
  title: string;
  writer: string;
  date: string;
  views: string;
  link: string; // ✅ 추가
};

function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    API.get("/api/notices")
      .then(res => {
        console.log("받은 데이터:", res.data); //chrome F12 console 확인
        setNotices(res.data);
      })
      .catch(err => console.error("공지 불러오기 실패:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📢 공지사항</h2>
      {notices.length === 0 ? (
        <p>📭 공지사항이 없습니다.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">번호</th>
              <th className="border p-2">제목</th>
              <th className="border p-2">작성자</th>
              <th className="border p-2">작성일</th>
              <th className="border p-2">조회수</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((n, idx) => (
              <tr key={idx}>
                <td className="border p-2">{n.number}</td>
                <td className="border p-2 text-blue-700 underline">
                  <a href={n.link} target="_blank" rel="noopener noreferrer">
                    {n.title}
                  </a>
                </td>
                <td className="border p-2">{n.writer}</td>
                <td className="border p-2">{n.date}</td>
                <td className="border p-2">{n.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NoticeBoard;
