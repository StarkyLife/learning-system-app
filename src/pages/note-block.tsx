import { Divider, Grid, IconButton, InputBase, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useCallback, useEffect, useState } from "react";

type Props = {
  id: string;
  title: string;
  onSave: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
};

export const NoteBlock: React.FC<Props> = ({
  id,
  title,
  onSave,
  onDelete,
  onOpen,
}) => {
  const [titleValue, setTitleValue] = useState(title);

  useEffect(() => {
    setTitleValue(title);
  }, [title]);

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

  return (
    <Paper elevation={4}>
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
