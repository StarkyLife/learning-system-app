import { Container, Stack } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Note } from "../entities/notes";
import { useNotesGateway } from "../gateways/use-notes-gateway";
import { NoteBlock } from "./note-block";

export const LearningSystemPage: React.FC = () => {
  const { getNotes, saveNote } = useNotesGateway();

  const [notes, setNotes] = useState<Note[]>([]);
  const initializeNotes = useCallback(async () => {
    const fetchedNotes = await getNotes();
    setNotes(fetchedNotes);
  }, [getNotes]);

  useEffect(() => {
    initializeNotes();
  }, []);

  const handleNoteSave = useCallback(
    async (id: string, title: string) => {
      await saveNote(id, title);
      await initializeNotes();
    },
    [saveNote, initializeNotes]
  );

  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        {notes.map((note) => (
          <NoteBlock
            key={note.id}
            id={note.id}
            title={note.title}
            onSave={handleNoteSave}
          />
        ))}
      </Stack>
    </Container>
  );
};
