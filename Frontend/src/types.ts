export interface Contact {
  id: string;
  name: string;
  email: string;
}

export interface Activity {
  id: string;
  type: "sent" | "received";
  date: string;
  description: string;
}
