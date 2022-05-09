import { CssBaseline } from "@mui/material";
import { InMemoryNotesGateway } from "../gateways/in-memory-notes.gateway";
import { NotestGatewayContext } from "../gateways/notes.gateway";
import { LearningSystemPage } from "../pages/learning-system-page";

export const App: React.FC = () => (
  <>
    <CssBaseline />
    <NotestGatewayContext.Provider value={new InMemoryNotesGateway()}>
      <LearningSystemPage />
    </NotestGatewayContext.Provider>
  </>
);
