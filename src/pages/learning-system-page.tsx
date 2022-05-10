import { Button, Container, Stack } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Note } from "../entities/notes";
import { useNotesGateway } from "../gateways/use-notes-gateway";
import { NoteBlock } from "./note-block";

export const LearningSystemPage: React.FC = () => {
  const { getNotes, saveNote, createNewNote, deleteNote } = useNotesGateway();

  const [notes, setNotes] = useState<Note[]>([]);
  const initializeNotes = useCallback(async () => {
    const fetchedNotes = await getNotes();
    setNotes(fetchedNotes);
  }, [getNotes]);

  useEffect(() => {
    initializeNotes();
  }, [initializeNotes]);

  const handleNoteUpdate = useCallback(
    async (id: string, title: string) => {
      await saveNote(id, title);
      await initializeNotes();
    },
    [saveNote, initializeNotes]
  );
  const handleNewNoteCreate = useCallback(async () => {
    await createNewNote();
    await initializeNotes();
  }, [createNewNote, initializeNotes]);
  const handleNoteDelete = useCallback(
    async (id: string) => {
      await deleteNote(id);
      await initializeNotes();
    },
    [initializeNotes, deleteNote]
  );

  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        {notes.map((note) => (
          <NoteBlock
            key={note.id}
            id={note.id}
            title={note.title}
            onSave={handleNoteUpdate}
            onDelete={handleNoteDelete}
          />
        ))}
        <Button variant="outlined" onClick={handleNewNoteCreate}>
          Add new
        </Button>
      </Stack>
    </Container>
  );
};
