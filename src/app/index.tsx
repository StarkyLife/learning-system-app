import { CssBaseline } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LocalStorageNotesGateway } from "../gateways/local-storage-notes.gateway";
import { NotesGatewayContext } from "../gateways/notes.gateway";
import { Routing } from "../pages/routing";

export const App: React.FC = () => (
  <>
    <CssBaseline />
    <DndProvider backend={HTML5Backend}>
      <NotesGatewayContext.Provider value={new LocalStorageNotesGateway()}>
        <Routing />
      </NotesGatewayContext.Provider>
    </DndProvider>
  </>
);
