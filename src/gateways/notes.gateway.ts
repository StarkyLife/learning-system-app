import React from "react";
import { NoteView } from "../entities/notes";

export interface NotesGateway {
  getMainNote(): Promise<NoteView>;
  getNote(id: string): Promise<NoteView | null>;
  saveNote(id: string, parentId: string, text?: string): Promise<void>;
  createNewNote(parentId: string): Promise<void>;
  deleteNote(id: string): Promise<void>;
}

export const NotesGatewayContext = React.createContext<NotesGateway | null>(
  null
);
