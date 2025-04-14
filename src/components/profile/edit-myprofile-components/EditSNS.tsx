{/* SNS 링크 입력 필드 */}
import React from "react";

interface EditSNSProps {
  sns: string[];
  isEditing: boolean;
  onChange: (sns: string[]) => void;
}

export default function EditSNS({ sns, isEditing, onChange }: EditSNSProps) {
  return (
    <div className="flex items-start mb-4">
      <label className="w-28 text-sm font-semibold mt-2">SNS 링크</label>
      <div className="flex-1 space-y-3">
        {isEditing ? (
          <>
            <div className="flex items-center gap-2">
              <span className="w-20 text-sm font-semibold">Github</span>
              <input
                type="text"
                value={sns[0]}
                onChange={(e) => {
                  const newSNS = [...sns];
                  newSNS[0] = e.target.value;
                  onChange(newSNS);
                }}
                className="flex-1 p-2 border rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 text-sm font-semibold">LinkedIn</span>
              <input
                type="text"
                value={sns[1]}
                onChange={(e) => {
                  const newSNS = [...sns];
                  newSNS[1] = e.target.value;
                  onChange(newSNS);
                }}
                className="flex-1 p-2 border rounded"
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <img src="/assets/images/github-logo.png" alt="GitHub" className="w-5 h-5" />
              <a
                href={sns[0]}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-700 hover:underline break-all"
              >
                {sns[0]}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <img src="/assets/images/LinkedIn-logo.png" alt="LinkedIn" className="w-5 h-5" />
              <a
                href={sns[1]}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-700 hover:underline break-all"
              >
                {sns[1]}
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

