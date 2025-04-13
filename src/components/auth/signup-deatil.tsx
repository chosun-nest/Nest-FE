import { useState } from "react";
import * as S from "../../assets/styles/auth.styles";
import { Item, SignUpDetailProps } from "../../types/signup";

export default function SignUpDetail({
  selected,
  onPrev,
  onSubmit,
  name,
  onChangeName,
  onChangeDepartment,
  interest,
  onChangeInterest,
  skills,
  onChangeSkills,
  techList,
  interestsList,
  departmentsList,
}: SignUpDetailProps) {
  const [interestInput, setInterestInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");

  const [filteredInterests, setFilteredInterests] = useState<Item[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Item[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Item[]>([]);

  // 관심 분야 입력
  const handleInterestInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setInterestInput(value);
    if (value.trim() !== "") {
      const filtered = interestsList.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredInterests(filtered);
    } else {
      setFilteredInterests([]);
    }
  };

  // 기술 스택 입력
  const handleSkillsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillsInput(value);
    if (value.trim() !== "") {
      const filtered = techList.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  };

  // 학과 입력
  const handleDepartmentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setDepartmentInput(value);
    if (value.trim() !== "") {
      const filtered = departmentsList.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments([]);
    }
  };

  const handleSelectInterest = (item: Item) => {
    if (!interest.some((i) => i.id === item.id)) {
      onChangeInterest([...interest, item]);
    }
    setInterestInput("");
    setFilteredInterests([]);
  };

  const handleSelectSkill = (item: Item) => {
    if (!skills.some((i) => i.id === item.id)) {
      onChangeSkills([...skills, item]);
    }
    setSkillsInput("");
    setFilteredSkills([]);
  };

  const handleSelectDepartment = (item: Item) => {
    onChangeDepartment(item);
    setDepartmentInput(item.name);
    setFilteredDepartments([]);
  };

  const handleRemove = (
    index: number,
    list: Item[],
    setList: (v: Item[]) => void
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <S.LoginBox>
      <S.HeaderBox>
        <S.HeaderLogo src="/assets/images/logo.png" />
        <S.Title>Welcome to WantIT-NEST</S.Title>
        <S.SigninTitle>회원가입</S.SigninTitle>
      </S.HeaderBox>

      <S.InputTitle>이름</S.InputTitle>
      <S.Input
        placeholder="이름을 입력해주세요"
        value={name}
        onChange={(e) => onChangeName(e.target.value)}
      />
      <S.SubText $isValid={!!name}>⚠ 실명으로 입력해주세요!</S.SubText>

      {selected === "재학생" && (
        <>
          <S.InputTitle>학과 검색</S.InputTitle>
          <S.InputWrapper>
            <S.Input
              placeholder="학과를 입력하세요"
              value={departmentInput}
              onChange={handleDepartmentInputChange}
            />
            {filteredDepartments.length > 0 && (
              <S.Dropdown>
                {filteredDepartments.map((item, idx) => (
                  <S.DropdownItem
                    key={idx}
                    onClick={() => handleSelectDepartment(item)}
                  >
                    {item.name}
                  </S.DropdownItem>
                ))}
              </S.Dropdown>
            )}
          </S.InputWrapper>
        </>
      )}

      {/* 관심 분야 */}
      <S.InputTitle>관심 분야</S.InputTitle>
      <S.InputWrapper>
        <S.Input
          placeholder="ex) 백엔드, AI"
          value={interestInput}
          onChange={handleInterestInputChange}
        />
        {filteredInterests.length > 0 && (
          <S.Dropdown>
            {filteredInterests.map((item, idx) => (
              <S.DropdownItem
                key={idx}
                onClick={() => handleSelectInterest(item)}
              >
                {item.name}
              </S.DropdownItem>
            ))}
          </S.Dropdown>
        )}
      </S.InputWrapper>
      <S.TagList>
        {interest.map((item, idx) => (
          <S.TagItem key={idx}>
            {item.name}
            <S.TagRemoveButton
              onClick={() => handleRemove(idx, interest, onChangeInterest)}
            >
              ✕
            </S.TagRemoveButton>
          </S.TagItem>
        ))}
      </S.TagList>

      {/* 기술 스택 */}
      <S.InputTitle>기술 스택</S.InputTitle>
      <S.InputWrapper>
        <S.Input
          placeholder="ex) React, TypeScript"
          value={skillsInput}
          onChange={handleSkillsInputChange}
        />
        {filteredSkills.length > 0 && (
          <S.Dropdown>
            {filteredSkills.map((item, idx) => (
              <S.DropdownItem key={idx} onClick={() => handleSelectSkill(item)}>
                {item.name}
              </S.DropdownItem>
            ))}
          </S.Dropdown>
        )}
      </S.InputWrapper>
      <S.TagList>
        {skills.map((item, idx) => (
          <S.TagItem key={idx}>
            #{item.name}
            <S.TagRemoveButton
              onClick={() => handleRemove(idx, skills, onChangeSkills)}
            >
              ✕
            </S.TagRemoveButton>
          </S.TagItem>
        ))}
      </S.TagList>

      <S.ButtonRow>
        <S.LoginButton
          onClick={onPrev}
          style={{ background: "#ccc", color: "#000" }}
        >
          이전
        </S.LoginButton>
        <S.LoginButton onClick={onSubmit}>회원가입</S.LoginButton>
      </S.ButtonRow>
    </S.LoginBox>
  );
}
