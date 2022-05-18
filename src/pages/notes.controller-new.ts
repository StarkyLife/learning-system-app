import { NotesGateway } from "../gateways/notes.gateway";
import { ViewModelInteractor } from "../shared/lib/view-model-interactor";
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
    const mainNote = await this.deps.notesGateway.getMainNote();
    this.deps.viewModel.update({
      currentNote: mainNote,
    });
  };

  addChildNote = async () => {
    const currentNote = this.getCurrentNote();

    const newId = Date.now().toString();
    this.deps.viewModel.update({
      currentNote: {
        ...currentNote,
        content: [...currentNote.content, { id: newId, text: "" }],
      },
    });
  };

  saveChildNote = async (childNoteId: string, text: string) => {
    const currentNote = this.getCurrentNote();

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

    this.deps.viewModel.update({
      currentNote: {
        ...currentNote,
        content: updatedNoteContent,
      },
    });
  };

  deleteChildNote = async (childNoteId: string) => {
    const currentNote = this.getCurrentNote();

    this.deps.viewModel.update({
      currentNote: {
        ...currentNote,
        content: currentNote.content.filter((n) => n.id !== childNoteId),
      },
    });
  };

  private getCurrentNote() {
    const { currentNote } = this.deps.viewModel.get();

    if (!currentNote) {
      throw new Error("Notes weren't initialized!");
    }

    return currentNote;
  }
}
