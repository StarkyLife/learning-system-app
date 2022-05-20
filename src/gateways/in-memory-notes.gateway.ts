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

  getNotesArray() {
    return Array.from(this.notes.values());
  }

  private getOrCreateMain() {
    const note = this.notes.get(MAIN_ID);
    if (note) {
      return note;
    }

    const newMain: InMemoryDbNote = {
      id: MAIN_ID,
      text: "Main",
      content: [],
    };
    this.notes.set(newMain.id, newMain);
    return newMain;
  }

  private createShortNote = (parentId: string) => (id: string) => {
    const foundNote = this.notes.get(id);
    if (!foundNote) {
      console.error(
        `Found nonexistent note reference. ID = ${id}. ParentID = ${parentId}`
      );
      return null;
    }
    return {
      id: foundNote.id,
      text: foundNote.text,
    };
  };

  getMainNote: NotesGateway["getMainNote"] = async () => {
    const note = this.getOrCreateMain();
    return {
      id: note.id,
      text: note.text,
      content: note.content
        .map(this.createShortNote(note.id))
        .filter((n: ShortNote | null): n is ShortNote => Boolean(n)),
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
        .map(this.createShortNote(note.id))
        .filter((n: ShortNote | null): n is ShortNote => Boolean(n)),
    };
  };
  saveNote: NotesGateway["saveNote"] = async (updatedNote) => {
    let currentChildNotesIds: Map<string, string>;

    const noteToSaveInDb = this.notes.get(updatedNote.id);
    if (!noteToSaveInDb) {
      throw new Error(`Not found! Note ID = ${updatedNote.id}`);
    }
    currentChildNotesIds = new Map(
      noteToSaveInDb.content.map((id) => [id, id])
    );
    this.notes.set(updatedNote.id, {
      ...noteToSaveInDb,
      text: updatedNote.text,
      content: updatedNote.content.map((n) => n.id),
    });

    updatedNote.content.forEach((childNote) => {
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

  moveNote: NotesGateway["moveNote"] = async ({
    id,
    oldParentId,
    newParentId,
  }) => {
    const oldParent = this.notes.get(oldParentId);
    if (!oldParent) {
      throw new Error(`Not found! Note ID = ${oldParentId}`);
    }
    const newParent = this.notes.get(newParentId);
    if (!newParent) {
      throw new Error(`Not found! Note ID = ${newParentId}`);
    }

    this.notes.set(oldParent.id, {
      ...oldParent,
      content: oldParent.content.filter((i) => i !== id),
    });
    this.notes.set(newParent.id, {
      ...newParent,
      content: newParent.content.concat(id),
    });
  };
}
