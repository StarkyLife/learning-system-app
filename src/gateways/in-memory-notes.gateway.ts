import { Note } from "../entities/notes";
import { NotesGateway } from "./notes.gateway";

export class InMemoryNotesGateway implements NotesGateway {
  private notes: Map<string, Note> = new Map([
    [
      "categoryId-1",
      {
        id: "categoryId-1",
        type: "category",
        text: "В чем смысл жизни?",
      },
    ],
    [
      "textBlockId-1",
      {
        id: "textBlockId-1",
        type: "text",
        title: "Шёл я как-то домой...",
      },
    ],
  ]);

  getNotes: NotesGateway["getNotes"] = async () => {
    return Array.from(this.notes.values());
  };
  saveCategoryNote: NotesGateway["saveCategoryNote"] = async (id, text) => {
    this.notes.set(id, { id, type: "category", text });
  };
  saveTextNote: NotesGateway["saveTextNote"] = async (id, title) => {
    this.notes.set(id, { id, type: "text", title });
  };
}