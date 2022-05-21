import { NoteView, ShortNote } from "../../../entities/notes";
import { InMemoryDbNote } from "../../../gateways/in-memory-notes.gateway";

export class TestNote {
  constructor(public data: { id: string; text: string; parentId?: string }) {}

  getShortNote(): ShortNote {
    return {
      id: this.data.id,
      text: this.data.text,
    };
  }

  getNoteView(content: ShortNote[] = []): NoteView {
    return {
      id: this.data.id,
      text: this.data.text,
      parentId: this.data.parentId,
      content,
    };
  }

  getDbNote(content: string[] = []): InMemoryDbNote {
    return {
      id: this.data.id,
      text: this.data.text,
      content,
    };
  }
}
