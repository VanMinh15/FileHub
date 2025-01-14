export interface Activity {
  id: number;
  name: string;
  type: "File" | "Folder";
  action: "Sent" | "Received";
  userName: string;
  createdAt: string;
}
