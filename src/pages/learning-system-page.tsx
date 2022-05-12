import { Button, Container, IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState } from "react";
import { Note } from "../entities/notes";
import { useNotesGateway } from "../gateways/use-notes-gateway";
import { NoteBlock } from "./note-block";

export const LearningSystemPage: React.FC = () => {
  const { getNotes, getNote, saveNote, createNewNote, deleteNote } =
    useNotesGateway();

  const [currentParentId, setParentId] = useState<string | undefined>();
  const [notes, setNotes] = useState<Note[]>([]);
  const refreshNotes = useCallback(async () => {
    const fetchedNotes = await getNotes(currentParentId);
    setNotes(fetchedNotes);
  }, [getNotes, currentParentId]);
  const openNewNotes = useCallback(
    async (parentId: string | undefined) => {
      const fetchedNotes = await getNotes(parentId);
      setParentId(parentId);
      setNotes(fetchedNotes);
    },
    [getNotes]
  );

  useEffect(() => {
    openNewNotes(currentParentId);
  }, []);

  const handleNoteUpdate = useCallback(
    async (id: string, title: string) => {
      await saveNote(id, title, currentParentId);
      await refreshNotes();
    },
    [saveNote, refreshNotes, currentParentId]
  );
  const handleNewNoteCreate = useCallback(async () => {
    await createNewNote(currentParentId);
    await refreshNotes();
  }, [createNewNote, refreshNotes, currentParentId]);
  const handleNoteDelete = useCallback(
    async (id: string) => {
      await deleteNote(id);
      await refreshNotes();
    },
    [refreshNotes, deleteNote]
  );
  const handleNoteContentsOpen = useCallback(
    async (id: string) => {
      await openNewNotes(id);
    },
    [openNewNotes]
  );
  const handleGoingUp = useCallback(async () => {
    if (!currentParentId) throw new Error("There is no upper level notes!");
    const note = await getNote(currentParentId);
    if (!note)
      throw new Error(`Couldn't find note with id = ${currentParentId}`);

    await openNewNotes(note.parentId);
  }, [openNewNotes, getNote, currentParentId]);

  return (
    <Container maxWidth="md">
      {currentParentId && (
        <Button variant="text" onClick={handleGoingUp}>
          Back
        </Button>
      )}
      <Stack spacing={2}>
        {notes.map((note) => (
          <NoteBlock
            key={note.id}
            id={note.id}
            title={note.title}
            onSave={handleNoteUpdate}
            onDelete={handleNoteDelete}
            onOpen={handleNoteContentsOpen}
          />
        ))}
        <div>
          <IconButton
            color="primary"
            size="large"
            onClick={handleNewNoteCreate}
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        </div>
      </Stack>
    </Container>
  );
};
