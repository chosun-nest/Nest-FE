// 게시글 검색
interface InterestBoardSearchProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
}

export default function InterestBoardSearch({
  searchKeyword,
  setSearchKeyword,
}: InterestBoardSearchProps) {
  return (
    <input
      type="text"
      placeholder="제목, 내용 또는 작성자 검색"
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
      className="px-3 py-2.5 text-sm border rounded w-full sm:w-[280px] h-[38px]"
    />
  );
}
