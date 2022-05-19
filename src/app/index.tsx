import { CssBaseline } from "@mui/material";
import { InMemoryNotesGateway } from "../gateways/in-memory-notes.gateway";
import { NotesGatewayContext } from "../gateways/notes.gateway";
import { NotesPage } from "../pages/notes-page";

export const App: React.FC = () => (
  <>
    <CssBaseline />
    <NotesGatewayContext.Provider value={new InMemoryNotesGateway([])}>
      <NotesPage />
    </NotesGatewayContext.Provider>
  </>
);
