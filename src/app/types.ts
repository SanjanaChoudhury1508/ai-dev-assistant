export type Message = {
  role: "user" | "ai";
  text: string;
};

export type Session = {
  id: string;
  title: string;
  time: string;
  messages: Message[];
};