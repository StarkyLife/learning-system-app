import { Container, Stack } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { Note } from "../entities/notes";
import { NotestGatewayContext } from "../gateways/notes.gateway";
import { CategoryBlock } from "./category-block";
import { TextBlock } from "./text-block";

export const LearningSystemPage: React.FC = () => {
  const notesGateway = useContext(NotestGatewayContext);

  const [notes, setNotes] = useState<Note[]>([]);
  const getNotes = useCallback(async () => {
    const fetchedNotes = (await notesGateway?.getNotes()) ?? [];
    setNotes(fetchedNotes);
  }, [notesGateway]);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const handleCategoryNoteSave = useCallback(
    async (id: string, text: string) => {
      await notesGateway?.saveCategoryNote(id, text);
      await getNotes();
    },
    [notesGateway, getNotes]
  );
  const handleTextNoteSave = useCallback(
    async (id: string, title: string) => {
      await notesGateway?.saveTextNote(id, title);
      await getNotes();
    },
    [notesGateway, getNotes]
  );

  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        {notes.map((note) =>
          note.type === "category" ? (
            <CategoryBlock
              key={note.id}
              id={note.id}
              text={note.text}
              onSave={handleCategoryNoteSave}
            />
          ) : (
            <TextBlock
              key={note.id}
              id={note.id}
              title={note.title}
              onSave={handleTextNoteSave}
            />
          )
        )}
      </Stack>
    </Container>
  );
};
