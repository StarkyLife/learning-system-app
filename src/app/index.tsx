import { CssBaseline } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LocalStorageNotesGateway } from "../gateways/local-storage-notes.gateway";
import { NotesGatewayContext } from "../gateways/notes.gateway";
import { NotesPage } from "../pages/notes/notes-page";

export const App: React.FC = () => (
  <>
    <CssBaseline />
    <DndProvider backend={HTML5Backend}>
      <NotesGatewayContext.Provider value={new LocalStorageNotesGateway()}>
        <NotesPage />
      </NotesGatewayContext.Provider>
    </DndProvider>
  </>
);
