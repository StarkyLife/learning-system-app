import { Divider, Grid, IconButton, InputBase, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useCallback } from "react";
import { PositionalDropzone } from "./positional-dropzone";
import { useOneInputForm } from "./use-one-input-form";
import { useNoteDragAndDrop } from "./use-note-drag-and-drop";

type Props = {
  id: string;
  text: string;
  onSave: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
  onMoveIn: (id: string, newParentId: string) => void;
  onChangePosition: (
    id: string,
    relatedNoteId: string,
    position: "up" | "down"
  ) => void;
};

export const NoteBlock: React.FC<Props> = ({
  id,
  text,
  onSave,
  onDelete,
  onOpen,
  onMoveIn,
  onChangePosition,
}) => {
  const { textValue, handleTextChange } = useOneInputForm(text);

  const handleTextSave = useCallback(() => {
    onSave(id, textValue);
  }, [id, textValue, onSave]);
  const handleNoteDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);
  const handleContentsOpen = useCallback(() => {
    onOpen(id);
  }, [id, onOpen]);

  const {
    isDragging,
    showPositionalDropzones,
    isOverUpDropzone,
    isOverDownDropzone,
    isOverNoteDropzone,
    canDrop,
    upDropzoneRef,
    downDropzoneRef,
    noteRef,
  } = useNoteDragAndDrop(id, onMoveIn, onChangePosition);

  return (
    <div>
      {showPositionalDropzones && (
        <PositionalDropzone
          type="up"
          isOver={isOverUpDropzone}
          ref={upDropzoneRef}
        />
      )}
      <Paper
        elevation={4}
        sx={{
          opacity: isDragging ? 0.3 : 1,
          background:
            isOverNoteDropzone && canDrop ? "rgba(0,0,0,0.2)" : undefined,
        }}
        ref={noteRef}
      >
        <Grid container>
          <Grid
            item
            xs="auto"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {canDrop ? (
              <DoubleArrowIcon />
            ) : (
              <DragIndicatorIcon cursor="move" />
            )}
          </Grid>
          <Grid item xs="auto">
            <Divider orientation="vertical" />
          </Grid>
          <Grid item xs p={1}>
            <InputBase
              fullWidth
              multiline
              placeholder="Напишите что-нибудь..."
              value={textValue}
              onChange={handleTextChange}
              onBlur={handleTextSave}
              sx={{ height: "100%" }}
            />
          </Grid>
          <Grid item xs="auto">
            <Divider orientation="vertical" />
          </Grid>
          <Grid item xs="auto">
            <IconButton onClick={handleNoteDelete}>
              <DeleteIcon />
            </IconButton>
            <Divider />
            <IconButton onClick={handleContentsOpen}>
              <NavigateNextIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
      {showPositionalDropzones && (
        <PositionalDropzone
          type="down"
          isOver={isOverDownDropzone}
          ref={downDropzoneRef}
        />
      )}
    </div>
  );
};
