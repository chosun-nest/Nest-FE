export interface NoticeItem {
  number: string;
  title: string;
  writer: string;
  date: string;
  views: string;
  link: string;
  category?: string;
  deadline?: string;
}

export interface NoticeListResponse {
  notices: NoticeItem[];
}