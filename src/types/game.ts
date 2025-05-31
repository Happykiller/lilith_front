export interface GameModel {
  id: string;
  name: string;
  author: { code: string };
  members: string[];
  members_obj: { id: string; code: string }[];
  items: {
    id: string;
    name: string;
    author: { code: string };
    state: string;
    description?: string;
    url?: string;
  }[];
}