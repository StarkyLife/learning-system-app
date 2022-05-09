import { InputBase, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { BlockBase } from "./base-block";

type Props = {
  id: string;
  title: string;
  onSave: (id: string, title: string) => void;
};

export const TextBlock: React.FC<Props> = ({ id, title, onSave }) => {
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
    // TODO: debounce?
    onSave(id, titleValue);
  }, [id, titleValue, onSave]);

  return (
    <BlockBase>
      <InputBase
        fullWidth
        multiline
        value={titleValue}
        onChange={handleTitleChange}
        onBlur={handleTitleSave}
      />
      <Typography>Hidden content</Typography>
    </BlockBase>
  );
};
