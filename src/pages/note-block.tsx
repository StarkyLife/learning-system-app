import { Divider, Grid, IconButton, InputBase, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useCallback, useEffect, useState } from "react";
import { throttle } from "../shared/lib/throttle";

type Props = {
  id: string;
  text: string;
  onSave: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
};

export const NoteBlock: React.FC<Props> = ({
  id,
  text,
  onSave,
  onDelete,
  onOpen,
}) => {
  const [titleValue, setTitleValue] = useState(text);

  useEffect(() => {
    setTitleValue(text);
  }, [text]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setTitleValue(e.target.value),
    []
  );
  const handleTitleSave = useCallback(() => {
    onSave(id, titleValue);
  }, [id, titleValue, onSave]);
  const handleNoteDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);
  const handleContentsOpen = useCallback(() => {
    onOpen(id);
  }, [id, onOpen]);

  const [isHoveredByOtherBlock, setHoveredByOtherBlock] = useState(false);
  const handleDragOver = useCallback(
    throttle(() => {
      setHoveredByOtherBlock(true);
    }, 300),
    []
  );
  const handleDragLeave = useCallback(() => {
    setHoveredByOtherBlock(false);
  }, []);

  return (
    <Paper
      elevation={4}
      sx={{
        opacity: isHoveredByOtherBlock ? 0.1 : 1,
      }}
      draggable
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Grid container>
        <Grid item xs p={1}>
          <InputBase
            fullWidth
            multiline
            placeholder="Напишите что-нибудь..."
            value={titleValue}
            onChange={handleTitleChange}
            onBlur={handleTitleSave}
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
