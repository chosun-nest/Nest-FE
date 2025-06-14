import { Notice } from "../../routes/NoticeBoard";

const NoticeCard = ({ notice }: { notice: Notice }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "#fff",
      }}
    >
      <a
        href={notice.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#00256C" }}
      >
        {notice.title}
      </a>

      {notice.category === "장학공지" && notice.deadline && (
        <div
          style={{
            marginTop: "4px",
            fontSize: "0.8rem",
            color: "#d32f2f",
            fontWeight: "bold",
          }}
        >
          접수 마감일: {notice.deadline}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.85rem",
          color: "#888",
          marginTop: "8px",
        }}
      >
        <span>
          {notice.writer} · {notice.date}
        </span>
        <span>조회수 {notice.views}</span>
      </div>
    </div>
  );
};

export default NoticeCard;
