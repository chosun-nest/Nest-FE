// SNS 링크 입력 필드
import { GithubLogo, LinkedinLogo, InstagramLogo } from "phosphor-react";

interface EditSNSProps {
  sns: string[];
  isEditing: boolean;
  onChange: (sns: string[]) => void;
}

export default function EditSNS({ sns, isEditing, onChange }: EditSNSProps) {
  return (
    <div className="flex flex-col mb-4 sm:flex-row">
      <label className="text-sm font-semibold mb-1 sm:mb-0 sm:w-28 min-w-[5rem] mt-2 sm:mt-0">
        SNS 링크
      </label>

      <div className="flex-1 space-y-3">
        {isEditing ? (
          <>
            {["Github", "LinkedIn", "Instagram"].map((label, idx) => (
              <div key={label} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="w-20 text-sm font-semibold">{label}</span>
                <input
                  type="text"
                  value={sns[idx] ?? ""}
                  onChange={(e) => {
                    const newSNS = [...sns];
                    newSNS[idx] = e.target.value;
                    onChange(newSNS);
                  }}
                  className="flex-1 w-full p-2 border rounded"
                />
              </div>
            ))}
          </>
        ) : (
          <>
            {[
              { icon: <GithubLogo size={20} color="#002f6c" />, url: sns[0] },
              { icon: <LinkedinLogo size={20} color="#002f6c" />, url: sns[1] },
              { icon: <InstagramLogo size={20} color="#002f6c" />, url: sns[2] },
            ].map(
              (item, idx) =>
                item.url && (
                  <div key={idx} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    {item.icon}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-sm text-blue-700 break-all hover:underline"
                    >
                      {item.url}
                    </a>
                  </div>
                )
            )}
          </>
        )}
      </div>
    </div>
  );
}
