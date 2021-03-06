import { NoteView } from "../../../entities/notes";
import { NotesGateway } from "../../../gateways/notes.gateway";
import { ViewModelInteractor } from "../../../shared/lib/view-model-interactor";
import { NotesViewModel } from "./notes.view-model";

export type NotesControllerDeps = {
  viewModel: ViewModelInteractor<NotesViewModel>;
  notesGateway: NotesGateway;
};

export class NotesController {
  private deps!: NotesControllerDeps;

  setDependencies(deps: NotesControllerDeps) {
    this.deps = deps;
    return this;
  }

  init = async () => {
    const note = await this.deps.notesGateway.getMainNote();
    this.deps.viewModel.update({
      currentNote: note,
    });
  };

  addChildNote = async () => {
    const currentNote = this.tryGetCurrentNote();

    const newId = Date.now().toString();
    const updatedNote: NoteView = {
      ...currentNote,
      content: [...currentNote.content, { id: newId, text: "" }],
    };

    this.deps.viewModel.update({
      currentNote: updatedNote,
    });
    await this.deps.notesGateway.saveNote(updatedNote);
  };

  saveChildNote = async (childNoteId: string, text: string) => {
    const currentNote = this.tryGetCurrentNote();

    const childNoteIdx = currentNote.content.findIndex(
      (n) => n.id === childNoteId
    );
    if (childNoteIdx < 0) {
      throw new Error(`Child note (id=${childNoteId}) wasn't found!`);
    }

    const updatedNoteContent = [...currentNote.content];
    updatedNoteContent[childNoteIdx] = {
      ...updatedNoteContent[childNoteIdx],
      text,
    };
    const updatedNote = {
      ...currentNote,
      content: updatedNoteContent,
    };

    this.deps.viewModel.update({
      currentNote: updatedNote,
    });
    await this.deps.notesGateway.saveNote(updatedNote);
  };

  deleteChildNote = async (childNoteId: string) => {
    const currentNote = this.tryGetCurrentNote();

    const updatedNote = {
      ...currentNote,
      content: currentNote.content.filter((n) => n.id !== childNoteId),
    };

    this.deps.viewModel.update({
      currentNote: updatedNote,
    });
    await this.deps.notesGateway.saveNote(updatedNote);
  };

  openChildNote = async (childNoteId: string) => {
    const note = await this.tryGetNoteWith(childNoteId);

    this.deps.viewModel.update({
      currentNote: note,
    });
  };

  goToUpperLevel = async () => {
    const currentNote = this.tryGetCurrentNote();

    if (!currentNote.parentId) {
      throw new Error("There is no upper level notes!");
    }

    const note = await this.tryGetNoteWith(currentNote.parentId);

    this.deps.viewModel.update({
      currentNote: note,
    });
  };

  moveNoteIn = async (id: string, newParentId: string) => {
    const currentNote = this.tryGetCurrentNote();
    this.deps.viewModel.update({
      currentNote: {
        ...currentNote,
        content: currentNote.content.filter((n) => n.id !== id),
      },
    });
    await this.deps.notesGateway.moveNote({
      id,
      newParentId,
      oldParentId: currentNote.id,
    });
  };

  moveNoteOut = async (id: string) => {
    const currentNote = this.tryGetCurrentNote();
    if (!currentNote.parentId) {
      throw new Error("There is no upper level notes!");
    }

    this.deps.viewModel.update({
      currentNote: {
        ...currentNote,
        content: currentNote.content.filter((n) => n.id !== id),
      },
    });
    await this.deps.notesGateway.moveNote({
      id,
      newParentId: currentNote.parentId,
      oldParentId: currentNote.id,
    });
  };

  changeNotePosition = async (
    noteId: string,
    relatedNoteId: string,
    position: "up" | "down"
  ) => {
    const currentNote = this.tryGetCurrentNote();

    const noteToMoveIndex = currentNote.content.findIndex(
      (n) => n.id === noteId
    );
    if (noteToMoveIndex === -1) {
      throw new Error(
        `Can't move child note with ID = ${noteId}. Reason: it doesn't exist in current parent note.`
      );
    }

    const updatedNoteContent = [...currentNote.content];
    updatedNoteContent.splice(noteToMoveIndex, 1);

    const relatedNoteIndex = updatedNoteContent.findIndex(
      (n) => n.id === relatedNoteId
    );
    if (relatedNoteIndex === -1) {
      throw new Error(
        `Can't move child note with ID = ${noteId}. Reason: can't find related note with ID = ${relatedNoteId}.`
      );
    }

    updatedNoteContent.splice(
      position === "up" ? relatedNoteIndex : relatedNoteIndex + 1,
      0,
      currentNote.content[noteToMoveIndex]
    );

    const updatedNote: NoteView = {
      ...currentNote,
      content: updatedNoteContent,
    };

    this.deps.viewModel.update({
      currentNote: updatedNote,
    });
    await this.deps.notesGateway.saveNote(updatedNote);
  };

  private tryGetCurrentNote() {
    const { currentNote } = this.deps.viewModel.get();
    if (!currentNote) {
      throw new Error("Notes weren't initialized!");
    }
    return currentNote;
  }

  private async tryGetNoteWith(id: string) {
    const note = await this.deps.notesGateway.getNote(id);
    if (!note) {
      throw new Error(`Couldn't find note with id = ${id}`);
    }
    return note;
  }
}
