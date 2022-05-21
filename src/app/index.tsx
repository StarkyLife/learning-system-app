import { CssBaseline } from "@mui/material";
import { LocalStorageNotesGateway } from "../gateways/local-storage-notes.gateway";
import { NotesGatewayContext } from "../gateways/notes.gateway";
import { NotesPage } from "../pages/notes/notes-page";

export const App: React.FC = () => (
  <>
    <CssBaseline />
    <NotesGatewayContext.Provider value={new LocalStorageNotesGateway()}>
      <NotesPage />
    </NotesGatewayContext.Provider>
  </>
);
