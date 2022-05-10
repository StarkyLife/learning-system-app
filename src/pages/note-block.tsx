import { Button, InputBase, Paper } from "@mui/material";
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
    <Paper variant="outlined">
      <InputBase
        fullWidth
        multiline
        value={titleValue}
        onChange={handleTitleChange}
        onBlur={handleTitleSave}
      />
      <Button variant="text" onClick={handleNoteDelete}>
        Delete
      </Button>
      <Button variant="text" onClick={handleContentsOpen}>
        Open contents
      </Button>
    </Paper>
  );
};
