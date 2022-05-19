import { ShortNote } from "../entities/notes";
import { NotesGateway } from "./notes.gateway";

const MAIN_ID = "main";

export type InMemoryDbNote = {
  id: string;
  text: string;
  content: string[];
};

export class InMemoryNotesGateway implements NotesGateway {
  private notes: Map<string, InMemoryDbNote>;

  constructor(dbNotes: InMemoryDbNote[]) {
    this.notes = new Map(dbNotes.map((n) => [n.id, n]));
  }

  private getNotesArray() {
    return Array.from(this.notes.values());
  }

  getMainNote: NotesGateway["getMainNote"] = async () => {
    const notesAsArray = this.getNotesArray();
    const notLinkedNotes = notesAsArray.filter(
      (checkingNote) =>
        !notesAsArray.some((potentialParentNote) =>
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

    const note = this.notes.get(id);
    if (!note) {
      return null;
    }

    const parentNote = this.getNotesArray().find((potentialParentNote) =>
      potentialParentNote.content.includes(note.id)
    );
    return {
      id: note.id,
      text: note.text,
      parentId: parentNote?.id || MAIN_ID,
      content: note.content
        .map((childNoteId) => {
          const foundNote = this.notes.get(childNoteId);
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
    let currentChildNotesIds: Map<string, string>;

    if (noteToSave.id !== MAIN_ID) {
      const noteToSaveInDb = this.notes.get(noteToSave.id);
      if (!noteToSaveInDb) {
        throw new Error(`Not found! Note ID = ${noteToSave.id}`);
      }
      currentChildNotesIds = new Map(
        noteToSaveInDb.content.map((id) => [id, id])
      );
      this.notes.set(noteToSave.id, {
        ...noteToSaveInDb,
        text: noteToSave.text,
        content: noteToSave.content.map((n) => n.id),
      });
    } else {
      const mainNote = await this.getMainNote();
      currentChildNotesIds = new Map(mainNote.content.map((n) => [n.id, n.id]));
    }

    noteToSave.content.forEach((childNote) => {
      const existingNote = this.notes.get(childNote.id);
      if (existingNote) {
        this.notes.set(childNote.id, {
          ...existingNote,
          text: childNote.text,
        });
      } else {
        this.notes.set(childNote.id, {
          id: childNote.id,
          text: childNote.text,
          content: [],
        });
      }

      currentChildNotesIds.delete(childNote.id);
    });

    currentChildNotesIds.forEach((id) => {
      this.notes.delete(id);
    });
  };
}
