import { Box, Button } from "@mui/material";
import { useDrop } from "react-dnd";
import { DragItemTypes } from "../../shared/drag-items";

type Props = {
  onBack: () => void;
  onDrop: (id: string) => void;
};

export const BackComponent: React.FC<Props> = ({ onBack, onDrop }) => {
  const [{ isOver }, dropRef] = useDrop(
    {
      accept: DragItemTypes.NOTE,
      drop: (item: { id: string }) => {
        onDrop(item.id);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    },
    [onDrop]
  );

  return (
    <Box
      ref={dropRef}
      sx={{
        background: isOver ? "rgba(0,0,0,0.1)" : undefined,
      }}
    >
      <Button variant="text" onClick={onBack}>
        Back
      </Button>
    </Box>
  );
};
