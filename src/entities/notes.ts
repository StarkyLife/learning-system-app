export type ShortNote = {
  id: string;
  text: string;
};

export type NoteView = {
  id: string;
  parentId?: string;
  text: string;
  content: ShortNote[];
};
