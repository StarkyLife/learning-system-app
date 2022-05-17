import {
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useEffect, useMemo, useState } from "react";
import { NoteBlock } from "./note-block";
import { NotesGatewayContext } from "../gateways/notes.gateway";
import { NotesController } from "./notes.controller";
import { DEFAULT_NOTES_VIEW_MODEL } from "./notes.view-model";
import { createViewModelInteractor } from "../shared/lib/view-model-interactor";

export const NotesPage: React.FC = () => {
  const notesGateway = useContext(NotesGatewayContext);
  if (!notesGateway) throw new Error("NotesGateway have not been connected!");

  const [viewModel, setViewModel] = useState(DEFAULT_NOTES_VIEW_MODEL);

  const notInitializedController = useMemo(() => new NotesController(), []);
  const controller = useMemo(
    () =>
      notInitializedController.setDependencies({
        notesGateway,
        viewModel: createViewModelInteractor(viewModel, setViewModel),
      }),
    [notInitializedController, notesGateway, viewModel]
  );

  useEffect(() => {
    controller.init();
  }, [controller]);

  if (!viewModel.currentNote) {
    return <div>Not ready</div>;
  }

  return (
    <Container maxWidth="md">
      {viewModel.currentNote.parentId && (
        <Button variant="text" onClick={controller.goUp}>
          Back
        </Button>
      )}
      <Typography noWrap>{viewModel.currentNote.text}</Typography>
      <Stack spacing={2}>
        {viewModel.currentNote.content.map((note) => (
          <NoteBlock
            key={note.id}
            id={note.id}
            text={note.text}
            onSave={controller.saveNote}
            onDelete={controller.deleteNote}
            onOpen={controller.openNote}
            onChangeParent={controller.changeParent}
          />
        ))}
        <div>
          <IconButton
            color="primary"
            size="large"
            onClick={controller.createNote}
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        </div>
      </Stack>
    </Container>
  );
};
