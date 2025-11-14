import { Notice } from "../../routes/NoticeBoard";

const NoticeCard = ({ notice }: { notice: Notice }) => {
  return (
    <a
      href={notice.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 border rounded-lg cursor-pointer hover:shadow"
    >
      {/* 제목과 카테고리 */}
      <div className="flex items-center gap-2 mb-2">
        {notice.category && (
          <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 border border-blue-300 rounded-full">
            {notice.category}
          </span>
        )}
        <h2 className="text-lg font-semibold text-[#00256C]">
          {notice.title}
        </h2>
      </div>

      {/* 장학공지 마감일 */}
      {notice.category === "장학공지" && notice.deadline && (
        <p className="mb-2 text-sm font-bold text-red-600">
          접수 마감일: {notice.deadline}
        </p>
      )}

      {/* 작성자, 날짜, 조회수 */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          {notice.writer} · {notice.date}
        </span>
        <span>조회수 {notice.views}</span>
      </div>
    </a>
  );
};

export default NoticeCard;
