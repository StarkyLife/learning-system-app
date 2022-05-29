import {
  InMemoryDbNote,
  InMemoryNotesGateway,
} from "./in-memory-notes.gateway";
import { NotesGateway } from "./notes.gateway";

const NOTES_KEY = "notes";

export class LocalStorageNotesGateway implements NotesGateway {
  private inMemoryGateway: InMemoryNotesGateway;

  constructor() {
    const notesAsString = localStorage.getItem(NOTES_KEY);
    const notes: InMemoryDbNote[] = notesAsString
      ? JSON.parse(notesAsString)
      : [];

    this.inMemoryGateway = new InMemoryNotesGateway(notes);
  }

  getMainNote: NotesGateway["getMainNote"] = async () => {
    const result = await this.inMemoryGateway.getMainNote();

    this.updateData();

    return result;
  };
  getNote: NotesGateway["getNote"] = async (id) => {
    const result = await this.inMemoryGateway.getNote(id);

    this.updateData();

    return result;
  };
  saveNote: NotesGateway["saveNote"] = async (updatedNote) => {
    const result = await this.inMemoryGateway.saveNote(updatedNote);

    this.updateData();

    return result;
  };

  moveNote: NotesGateway["moveNote"] = async (data) => {
    const result = await this.inMemoryGateway.moveNote(data);

    this.updateData();

    return result;
  };

  private updateData() {
    const updatedNotes = this.inMemoryGateway.getNotesArray();
    localStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
  }
}
