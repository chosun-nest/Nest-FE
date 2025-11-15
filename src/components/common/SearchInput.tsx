// src/components/common/SearchInput.tsx
import { ChangeEvent } from "react";

interface Props {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ value, onChange }: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="제목, 내용 또는 작성자 검색"
      style={{
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        width: "250px",
      }}
    />
  );
}