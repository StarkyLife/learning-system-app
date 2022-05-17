import { NotesGateway } from "./notes.gateway";

const MAIN_ID = "main";

type DbNote = {
  id: string;
  parentId: string;
  text: string;
};

export class InMemoryNotesGateway implements NotesGateway {
  private notes: Map<string, DbNote> = new Map([
    [
      "categoryId-1",
      {
        id: "categoryId-1",
        parentId: MAIN_ID,
        text: "В чем смысл жизни?",
      },
    ],
    [
      "textBlockId-1",
      {
        id: "textBlockId-1",
        parentId: "categoryId-1",
        text: "Шёл я как-то домой...",
      },
    ],
  ]);

  getMainNote: NotesGateway["getMainNote"] = async () => {
    const notes = Array.from(this.notes.values()).filter(
      (n) => n.parentId === MAIN_ID
    );
    return {
      id: MAIN_ID,
      text: "Main",
      content: notes.map((n) => ({
        id: n.id,
        text: n.text,
      })),
    };
  };
  getNote: NotesGateway["getNote"] = async (id) => {
    if (id === MAIN_ID) return this.getMainNote();

    const currentNote = this.notes.get(id);
    if (!currentNote) {
      return null;
    }

    const notes = Array.from(this.notes.values());
    const childNotes = notes.filter((n) => n.parentId === id);

    return {
      id: currentNote.id,
      parentId: currentNote.parentId,
      text: currentNote.text,
      content: childNotes.map((n) => ({
        id: n.id,
        text: n.text,
      })),
    };
  };
  saveNote: NotesGateway["saveNote"] = async (id, parentId, text) => {
    const current = this.notes.get(id);
    this.notes.set(id, {
      id,
      parentId,
      text: text || current?.text || "",
    });
  };
  createNewNote: NotesGateway["createNewNote"] = async (parentId) => {
    const newId = Date.now().toString();
    this.notes.set(newId, { id: newId, parentId, text: "" });
  };
  deleteNote: NotesGateway["deleteNote"] = async (id) => {
    this.notes.delete(id);

    const notes = Array.from(this.notes.values());
    const childNotes = notes.filter((n) => n.parentId === id);
    childNotes.forEach((n) => this.deleteNote(n.id));
  };
}
