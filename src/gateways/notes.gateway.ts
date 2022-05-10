import React from "react";
import { Note } from "../entities/notes";

export interface NotesGateway {
  getNotes(): Promise<Note[]>;
  saveNote(id: string, title: string): Promise<void>;
  createNewNote(): Promise<void>;
  deleteNote(id: string): Promise<void>;
}

export const NotesGatewayContext = React.createContext<NotesGateway | null>(
  null
);
