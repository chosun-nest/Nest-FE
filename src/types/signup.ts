type UserType = "재학생" | "일반";

type Item = {
  id: number;
  name: string;
};

type SignUpComponentProps = {
  selected: UserType;
  onChangeSelected: (value: UserType) => void;
  email: string;
  onChangeEmail: (value: string) => void;
  authCode: string;
  onChangeAuthCode: (value: string) => void;
  handleSendCode: () => void;
  handleVerifyCode: () => void;
  timer: number;
  password: string;
  onChangePassword: (value: string) => void;
  confirmPassword: string;
  onChangeConfirmPassword: (value: string) => void;
  isPasswordVisible: boolean;
  setIsPasswordVisible: (visible: boolean) => void;
  onNext: () => void;
  getItems: () => void;
  isEmailVerified: boolean;
};

type SignUpDetailProps = {
  selected: UserType;
  onPrev: () => void;
  onSubmit: () => void;
  name: string;
  onChangeName: (value: string) => void;
  department: Item | null;
  onChangeDepartment: (value: Item) => void;
  interest: Item[];
  onChangeInterest: (values: Item[]) => void;
  skills: Item[];
  onChangeSkills: (values: Item[]) => void;
  techList: Item[];
  interestsList: Item[];
  departmentsList: Item[];
};

type SignupPayload = {
  email: string;
  password: string;
  memberName: string;
  memberIsStudent: boolean;
  departmentIdList: number[];
  interestIdList: number[];
  techStackIdList: number[];
};

export type {
  SignupPayload,
  UserType,
  Item,
  SignUpComponentProps,
  SignUpDetailProps,
};
