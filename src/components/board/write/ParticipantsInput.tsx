// 참여정원 인원
interface Props {
  participants: string;
  setParticipants: (val: string) => void;
}

export default function ParticipantsInput({ participants, setParticipants }: Props) {
  return (
    <div className="mb-4 mt-7">
      <label className="block mb-2 text-lg font-semibold text-gray-500">
        최대 참여 인원
      </label>
      <input
        className="w-full p-3 border rounded"
        placeholder="최대 참여 인원 수를 적어주세요"
        value={participants}
        onChange={(e) => setParticipants(e.target.value)}
      />
    </div>
  );
}
