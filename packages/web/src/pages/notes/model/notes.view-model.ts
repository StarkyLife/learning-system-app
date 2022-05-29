import { NoteView } from "../../../entities/notes";

export type NotesViewModel = {
  currentNote: NoteView | null;
};

export const DEFAULT_NOTES_VIEW_MODEL: NotesViewModel = {
  currentNote: null,
};
