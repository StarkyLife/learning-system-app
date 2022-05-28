import { Container, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useEffect, useMemo, useState } from "react";
import { NoteBlock } from "./note-block";
import { NotesGatewayContext } from "../../gateways/notes.gateway";
import { NotesController } from "./model/notes.controller";
import { DEFAULT_NOTES_VIEW_MODEL } from "./model/notes.view-model";
import { createViewModelInteractor } from "../../shared/lib/view-model-interactor";
import { BackComponent } from "./back-component";

export const NotesPage: React.FC = () => {
  const notesGateway = useContext(NotesGatewayContext);
  if (!notesGateway) throw new Error("NotesGateway hasn't been connected!");

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
    <Container maxWidth="md" sx={{ padding: "16px" }}>
      {viewModel.currentNote.parentId && (
        <BackComponent
          onBack={controller.goToUpperLevel}
          onDrop={controller.moveNoteOut}
        />
      )}
      {viewModel.currentNote.text && (
        <Typography noWrap>{viewModel.currentNote.text}</Typography>
      )}
      <Stack spacing={2}>
        {viewModel.currentNote.content.map((note) => (
          <NoteBlock
            key={note.id}
            id={note.id}
            text={note.text}
            onSave={controller.saveChildNote}
            onDelete={controller.deleteChildNote}
            onOpen={controller.openChildNote}
            onMoveIn={controller.moveNoteIn}
            onChangePosition={controller.changeNotePosition}
          />
        ))}
        <div>
          <IconButton
            color="primary"
            size="large"
            onClick={controller.addChildNote}
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        </div>
      </Stack>
    </Container>
  );
};
