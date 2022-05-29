import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "../shared/routes";
import { MainPage } from "./main";
import { NotesPage } from "./notes";

export const Routing: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.notes} element={<NotesPage />} />
        <Route path={ROUTES.main} element={<MainPage />} />
      </Routes>
    </Router>
  );
};
