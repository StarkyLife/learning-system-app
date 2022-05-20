import React from "react";
import { NoteView } from "../entities/notes";

export interface NotesGateway {
  getMainNote(): Promise<NoteView>;
  getNote(id: string): Promise<NoteView | null>;
  saveNote(note: NoteView): Promise<void>;
  moveNote(data: {
    id: string;
    oldParentId: string;
    newParentId: string;
  }): Promise<void>;
}

export const NotesGatewayContext = React.createContext<NotesGateway | null>(
  null
);
