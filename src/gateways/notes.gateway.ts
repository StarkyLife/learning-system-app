import React from "react";
import { Note } from "../entities/notes";

export interface NotesGateway {
  getNotes(parentId: string | undefined): Promise<Note[]>;
  getNote(id: string): Promise<Note | null>;
  saveNote(
    id: string,
    title: string,
    parentId: string | undefined
  ): Promise<void>;
  createNewNote(parentId: string | undefined): Promise<void>;
  deleteNote(id: string): Promise<void>;
}

export const NotesGatewayContext = React.createContext<NotesGateway | null>(
  null
);
