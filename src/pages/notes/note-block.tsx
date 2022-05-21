import { Divider, Grid, IconButton, InputBase, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  DragEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { throttle } from "../../shared/lib/throttle";

const DRAG_TRANSFER_DATA_KEY = "noteId";

type Props = {
  id: string;
  text: string;
  onSave: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
  onChangeParent: (id: string, newParentId: string) => void;
};

export const NoteBlock: React.FC<Props> = ({
  id,
  text,
  onSave,
  onDelete,
  onOpen,
  onChangeParent,
}) => {
  const [textValue, setTextValue] = useState(text);

  useEffect(() => {
    setTextValue(text);
  }, [text]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setTextValue(e.target.value),
    []
  );
  const handleTextSave = useCallback(() => {
    onSave(id, textValue);
  }, [id, textValue, onSave]);
  const handleNoteDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);
  const handleContentsOpen = useCallback(() => {
    onOpen(id);
  }, [id, onOpen]);

  const [isHoveredByOtherBlock, setHoveredByOtherBlock] = useState(false);
  const [isDragged, setDragged] = useState(false);
  const setHoveredByOtherBlockThrottled = useMemo(
    () => throttle(setHoveredByOtherBlock, 300),
    []
  );
  const handleDragStart = useCallback<DragEventHandler<HTMLDivElement>>(
    (e) => {
      setDragged(true);
      e.dataTransfer.setData(DRAG_TRANSFER_DATA_KEY, id);
    },
    [id]
  );
  const handleDragEnd = useCallback<DragEventHandler<HTMLDivElement>>(() => {
    setDragged(false);
  }, []);
  const handleDragOver = useCallback<DragEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();
      setHoveredByOtherBlockThrottled(true);
    },
    [id]
  );
  const handleDragLeave = useCallback<DragEventHandler<HTMLDivElement>>(() => {
    setHoveredByOtherBlock(false);
  }, []);
  const handleDrop = useCallback<DragEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();
      setHoveredByOtherBlock(false);
      const draggedId = e.dataTransfer?.getData(DRAG_TRANSFER_DATA_KEY);
      if (draggedId === id) return;
      onChangeParent(draggedId, id);
    },
    [onChangeParent, id]
  );

  return (
    <Paper
      component="div"
      elevation={4}
      sx={{
        opacity: isDragged ? 0 : isHoveredByOtherBlock ? 0.1 : 1,
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Grid container>
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
  );
};
