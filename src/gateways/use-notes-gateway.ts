import { useContext } from "react";
import { NotesGatewayContext } from "./notes.gateway";

export function useNotesGateway() {
  const notesGateway = useContext(NotesGatewayContext);

  if (!notesGateway) throw new Error("NotesGateway have not been connected!");

  return notesGateway;
}
