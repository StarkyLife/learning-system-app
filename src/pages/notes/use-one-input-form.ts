import { useState, useEffect, useCallback } from "react";

export function useOneInputForm(text: string) {
  const [textValue, setTextValue] = useState(text);

  useEffect(() => {
    setTextValue(text);
  }, [text]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setTextValue(e.target.value),
    []
  );

  return { textValue, handleTextChange };
}
