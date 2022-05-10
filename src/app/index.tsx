import { CssBaseline } from "@mui/material";
import { InMemoryNotesGateway } from "../gateways/in-memory-notes.gateway";
import { NotesGatewayContext } from "../gateways/notes.gateway";
import { LearningSystemPage } from "../pages/learning-system-page";

export const App: React.FC = () => (
  <>
    <CssBaseline />
    <NotesGatewayContext.Provider value={new InMemoryNotesGateway()}>
      <LearningSystemPage />
    </NotesGatewayContext.Provider>
  </>
);
