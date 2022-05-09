export type CategoryNote = {
  id: string;
  type: "category";
  text: string;
};
export type TextNote = {
  id: string;
  type: "text";
  title: string;
};
export type Note = CategoryNote | TextNote;
