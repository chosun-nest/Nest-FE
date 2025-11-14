// 게시글 검색
interface NoticeBoardSearchProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
}

export default function NoticeBoardSearch({
  searchKeyword,
  setSearchKeyword,
}: NoticeBoardSearchProps) {
  return (
    <input
      type="text"
      placeholder="제목 또는 내용 검색"
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
      className="px-3 py-2 text-sm border rounded w-full sm:w-[300px]"
    />
  );
}
