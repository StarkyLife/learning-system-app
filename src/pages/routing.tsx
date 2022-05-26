import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainPage } from "./main";
import { NotesPage } from "./notes";

export const Routing: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/note" element={<NotesPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
};
