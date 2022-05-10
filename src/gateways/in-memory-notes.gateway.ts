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

  getNotes: NotesGateway["getNotes"] = async () => {
    return Array.from(this.notes.values());
  };
  saveNote: NotesGateway["saveNote"] = async (id, title) => {
    this.notes.set(id, { id, title });
  };
  createNewNote: NotesGateway["createNewNote"] = async () => {
    const newId = Date.now().toString();
    this.notes.set(newId, { id: newId, title: "" });
  };
  deleteNote: NotesGateway["deleteNote"] = async (id) => {
    this.notes.delete(id);
  };
}
