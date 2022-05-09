import React from "react";
import { Note } from "../entities/notes";

export interface NotesGateway {
  getNotes(): Promise<Note[]>;
  saveCategoryNote(id: string, text: string): Promise<void>;
  saveTextNote(id: string, title: string): Promise<void>;
}

export const NotestGatewayContext = React.createContext<NotesGateway | null>(
  null
);
