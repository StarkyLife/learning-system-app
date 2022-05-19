import { NoteView } from "../entities/notes";
import { NotesGateway } from "./notes.gateway";

const MAIN_ID = "main";

export class InMemoryNotesGateway implements NotesGateway {
  constructor(private notes: NoteView[]) {}

  getMainNote: NotesGateway["getMainNote"] = async () => {
    const children = this.notes.filter((n) => n.parentId === MAIN_ID);
    return {
      id: MAIN_ID,
      text: "Main",
      content: children.map((n) => ({
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
    return note;
  };
}
