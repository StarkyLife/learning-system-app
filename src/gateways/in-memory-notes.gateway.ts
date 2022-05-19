import { ShortNote } from "../entities/notes";
import { NotesGateway } from "./notes.gateway";

const MAIN_ID = "main";

export type InMemoryDbNote = {
  id: string;
  text: string;
  content: string[];
};

export class InMemoryNotesGateway implements NotesGateway {
  constructor(private notes: InMemoryDbNote[]) {}

  getMainNote: NotesGateway["getMainNote"] = async () => {
    const notLinkedNotes = this.notes.filter((checkingNote) =>
      !this.notes.some((potentialParentNote) =>
        potentialParentNote.content.includes(checkingNote.id)
      )
    );
    return {
      id: MAIN_ID,
      text: "Main",
      content: notLinkedNotes.map((n) => ({
        id: n.id,
        text: n.text,
      })),
    };
  };
  getNote: NotesGateway["getNote"] = async (id) => {
    if (id === MAIN_ID) return this.getMainNote();

    const note = this.notes.find((n) => n.id === id);
    if (!note) {
      return null;
    }

    const parentNote = this.notes.find((potentialParentNote) =>
      potentialParentNote.content.includes(note.id)
    );
    return {
      id: note.id,
      text: note.text,
      parentId: parentNote?.id || MAIN_ID,
      content: note.content
        .map((childNoteId) => {
          const foundNote = this.notes.find((n) => n.id === childNoteId);
          if (!foundNote) {
            console.error(
              `Found nonexistent note reference. ID = ${childNoteId}. ParentID = ${note.id}`
            );
            return null;
          }
          return {
            id: foundNote.id,
            text: foundNote.text,
          };
        })
        .filter((n: ShortNote | null): n is ShortNote => Boolean(n)),
    };
  };
  saveNote: NotesGateway["saveNote"] = async (noteToSave) => {
    if (noteToSave.id !== MAIN_ID) {
      const noteToSaveIdx = this.notes.findIndex((n) => n.id === noteToSave.id);
      if (noteToSaveIdx === -1) {
        throw new Error(`Not found! Note ID = ${noteToSave.id}`);
      }
      this.notes[noteToSaveIdx] = {
        ...this.notes[noteToSaveIdx],
        text: noteToSave.text,
        content: noteToSave.content.map((n) => n.id),
      };
    }

    noteToSave.content.forEach((childNote) => {
      const existingNoteIdx = this.notes.findIndex(
        (n) => n.id === childNote.id
      );
      if (existingNoteIdx === -1) {
        this.notes.push({
          id: childNote.id,
          text: childNote.text,
          content: [],
        });
      } else {
        this.notes[existingNoteIdx] = {
          ...this.notes[existingNoteIdx],
          text: childNote.text,
        };
      }
    });
  };
}
