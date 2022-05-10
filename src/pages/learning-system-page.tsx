import { Container, Stack } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { Note } from "../entities/notes";
import { NotestGatewayContext } from "../gateways/notes.gateway";
import { NoteBlock } from "./note-block";

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

  const handleTextNoteSave = useCallback(
    async (id: string, title: string) => {
      await notesGateway?.saveNote(id, title);
      await getNotes();
    },
    [notesGateway, getNotes]
  );

  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        {notes.map((note) => (
          <NoteBlock
            key={note.id}
            id={note.id}
            title={note.title}
            onSave={handleTextNoteSave}
          />
        ))}
      </Stack>
    </Container>
  );
};
