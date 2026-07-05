export interface Notification {
  _id: string;
  title: string;
  message: string;
  status: "unread" | "read";
  type: "warning" | "info" | "success";
  createdAt: string;
}