import { DragEventHandler, useMemo } from "react";
import { ConnectableElement, useDrag, useDrop } from "react-dnd";
import { DragItemTypes } from "../../shared/drag-items";

export function useNoteDragAndDrop(
  id: string,
  onInsideNoteDrop: (draggingNoteId: string, dropNoteId: string) => void,
  onPositionalDrop: (
    draggingNoteId: string,
    relatedNoteId: string,
    position: "up" | "down"
  ) => void
) {
  const [{ isDragging }, noteDragRef] = useDrag(
    () => ({
      type: DragItemTypes.NOTE,
      item: { id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id]
  );

  const [noteDropzone, noteDropzoneRef] = useDrop(
    () => ({
      accept: DragItemTypes.NOTE,
      drop: (item: { id: string }) => {
        onInsideNoteDrop(item.id, id);
      },
      canDrop: (item) => item.id !== id,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [onInsideNoteDrop, id]
  );

  const [upDropzone, upDropzoneRef] = useDrop(
    () => ({
      accept: DragItemTypes.NOTE,
      drop: (item: { id: string }) => {
        onPositionalDrop(item.id, id, "up");
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [id, onPositionalDrop]
  );

  const [downDropzone, downDropzoneRef] = useDrop(
    () => ({
      accept: DragItemTypes.NOTE,
      drop: (item: { id: string }) => {
        onPositionalDrop(item.id, id, "down");
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [id, onPositionalDrop]
  );

  const showPositionalDropzones =
    (noteDropzone.isOver && noteDropzone.canDrop) ||
    upDropzone.isOver ||
    downDropzone.isOver;

  const preventDragProps = useMemo<{
    onDragStart: DragEventHandler;
    draggable: boolean;
  }>(
    () => ({
      onDragStart: (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      draggable: true,
    }),
    []
  );

  return {
    preventDragProps,
    isDragging,
    showPositionalDropzones,
    isOverUpDropzone: upDropzone.isOver,
    isOverDownDropzone: downDropzone.isOver,
    isOverNoteDropzone: noteDropzone.isOver,
    canDrop: noteDropzone.canDrop,
    upDropzoneRef,
    downDropzoneRef,
    noteRef: (node: ConnectableElement) => noteDragRef(noteDropzoneRef(node)),
  };
}
