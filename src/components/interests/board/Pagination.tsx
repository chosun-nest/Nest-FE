// 관심분야 게시판 페이지네이션
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pagesPerGroup = 10;
  const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const groupStart = currentGroup * pagesPerGroup + 1;
  const groupEnd = Math.min(groupStart + pagesPerGroup - 1, totalPages);

  const pageButtons = [];
  for (let i = groupStart; i <= groupEnd; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`px-3 py-1 border rounded mx-1
          ${i === currentPage
            ? "bg-nestblue text-white"
            : "bg-white text-black hover:bg-nestblue/80 hover:text-white"}
        `}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex justify-center mt-6">
      {/* << 맨 처음 */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 border rounded hover:bg-nestblue/80 hover:text-white disabled:opacity-50"
      >
        ≪
      </button>

      {/* < 이전 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 border rounded hover:bg-nestblue/80 hover:text-white disabled:opacity-50"
      >
        &lt;
      </button>

      {/* 페이지 숫자 */}
      {pageButtons}

      {/* > 다음 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 mx-1 border rounded hover:bg-nestblue/80 hover:text-white disabled:opacity-50"
      >
        &gt;
      </button>

      {/* >> 맨 끝 */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 mx-1 border rounded hover:bg-nestblue/80 hover:text-white disabled:opacity-50"
      >
        ≫
      </button>
    </div>
  );
}

