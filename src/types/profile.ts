export interface Item {
  id: number;
  name: string;
}

export interface DepartmentResponse {
  departmentId: number;
  departmentName: string;
}

export interface TechStackResponse {
  techStackId: number;
  techStackName: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  major: string;
  introduce: string;
  //interests: string[];
  sns: string[];
  image: string;
  uploadedImagePath: string;
  techStacks: string[];
}
