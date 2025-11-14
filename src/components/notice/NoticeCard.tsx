import { Notice } from "../../routes/NoticeBoard";

// 카테고리 축약 매핑
const getCategoryShortName = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    "일반공지": "일반",
    "학사공지": "학사",
    "장학공지": "장학",
    "SW중심대학사업단": "소중대",
    "IT융합대학": "IT",
    "컴퓨터공학전공": "컴공",
    "인공지능공학전공": "인공",
    "정보통신공학전공": "정통",
    "모빌리티SW전공": "모빌",
  };

  return categoryMap[category] || category;
};

const NoticeCard = ({ notice }: { notice: Notice }) => {
  return (
    <a
      href={notice.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 border rounded-lg cursor-pointer hover:shadow"
    >
      {/* 제목과 카테고리 */}
      <div className="flex items-start gap-2 mb-2">
        {notice.category && (
          <span className="flex-shrink-0 px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 border border-blue-300 rounded-full whitespace-nowrap">
            {getCategoryShortName(notice.category)}
          </span>
        )}
        <h2 className="flex-1 min-w-0 text-lg font-semibold text-[#00256C] break-words">
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
