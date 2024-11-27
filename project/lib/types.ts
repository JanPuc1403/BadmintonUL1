export type User = {
  username: string;
  password: string;
  color: string;
  isAdmin: boolean;
};

export type SpecialEvent = {
  date: string;
  type: 'tournament' | 'training';
  createdBy: string;
};

export type Presence = {
  [date: string]: string[];
};