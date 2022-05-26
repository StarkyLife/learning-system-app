import { forwardRef } from "react";
import { Paper } from "@mui/material";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import MoveDownIcon from "@mui/icons-material/MoveDown";

type Props = {
  type: "up" | "down";
  isOver: boolean;
};

export const PositionalDropzone = forwardRef<HTMLDivElement, Props>(
  ({ type, isOver }, ref) => (
    <Paper
      variant="outlined"
      ref={ref}
      sx={{
        height: "56px",
        display: "flex",
        alignItems: "center",
        background: isOver ? "rgba(0,0,0,0.2)" : undefined,
      }}
    >
      {type === "up" ? <MoveUpIcon /> : <MoveDownIcon />}
    </Paper>
  )
);
