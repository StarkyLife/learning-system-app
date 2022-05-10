import { Note } from "../entities/notes";
import { NotesGateway } from "./notes.gateway";

export class InMemoryNotesGateway implements NotesGateway {
  private notes: Map<string, Note> = new Map([
    [
      "categoryId-1",
      {
        id: "categoryId-1",
        title: "В чем смысл жизни?",
      },
    ],
    [
      "textBlockId-1",
      {
        id: "textBlockId-1",
        title: "Шёл я как-то домой...",
      },
    ],
  ]);

  getNotes: NotesGateway["getNotes"] = async (parentId) => {
    const notes = Array.from(this.notes.values());
    return notes.filter((n) => n.parentId === parentId);
  };
  getNote: NotesGateway["getNote"] = async (id) => {
    return this.notes.get(id) || null;
  };
  saveNote: NotesGateway["saveNote"] = async (id, title, parentId) => {
    this.notes.set(id, { id, parentId, title });
  };
  createNewNote: NotesGateway["createNewNote"] = async (parentId) => {
    const newId = Date.now().toString();
    this.notes.set(newId, { id: newId, parentId, title: "" });
  };
  deleteNote: NotesGateway["deleteNote"] = async (id) => {
    this.notes.delete(id);
  };
}
