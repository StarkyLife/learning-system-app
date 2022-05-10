import React from "react";
import { Note } from "../entities/notes";

export interface NotesGateway {
  getNotes(): Promise<Note[]>;
  saveNote(id: string, title: string): Promise<void>;
}

export const NotestGatewayContext = React.createContext<NotesGateway | null>(
  null
);
