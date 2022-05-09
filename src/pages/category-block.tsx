import { InputBase } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { BlockBase } from "./base-block";

type Props = {
  id: string;
  text: string;
  onSave: (id: string, text: string) => void;
};

export const CategoryBlock: React.FC<Props> = ({ id, text, onSave }) => {
  const [textValue, setTextValue] = useState(text);

  useEffect(() => {
    setTextValue(text);
  }, [text]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setTextValue(e.target.value),
    []
  );
  const handleSave = useCallback(() => {
    // TODO: debounce?
    onSave(id, textValue);
  }, [id, textValue, onSave]);

  return (
    <BlockBase>
      <InputBase
        fullWidth
        multiline
        value={textValue}
        onChange={handleChange}
        onBlur={handleSave}
      />
    </BlockBase>
  );
};
