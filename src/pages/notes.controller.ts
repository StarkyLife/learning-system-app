import { NotesGateway } from "../gateways/notes.gateway";
import { ViewModelInteractor } from "../shared/lib/view-model-interactor";
import { NotesViewModel } from "./notes.view-model";

export type NotesControllerDeps = {
  notesGateway: NotesGateway;
  viewModel: ViewModelInteractor<NotesViewModel>;
};

export class NotesController {
  private deps!: NotesControllerDeps;

  setDependencies(deps: NotesControllerDeps) {
    this.deps = deps;
    return this;
  }

  init = async () => {
    const note = await this.deps.notesGateway.getMainNote();
    this.deps.viewModel.update({ currentNote: note });
  };

  openNote = async (id: string) => {
    const note = await this.deps.notesGateway.getNote(id);
    if (!note) {
      throw new Error("TODO");
    }
    this.deps.viewModel.update({ currentNote: note });
  };

  goUp = async () => {
    const { currentNote } = this.deps.viewModel.get();
    if (!currentNote) {
      throw new Error("App wasn't initialized!");
    }
    if (!currentNote.parentId) {
      throw new Error("There is no upper level notes!");
    }
    const note = await this.deps.notesGateway.getNote(currentNote.parentId);
    if (!note) {
      throw new Error(`Couldn't find note with id = ${currentNote.parentId}`);
    }
    await this.openNote(currentNote.parentId);
  };

  createNote = async () => {
    const { currentNote } = this.deps.viewModel.get();
    if (!currentNote) {
      throw new Error("App wasn't initialized!");
    }
    await this.deps.notesGateway.createNewNote(currentNote.id);
    await this.refreshCurrentNote();
  };

  saveNote = async (id: string, text: string) => {
    const { currentNote } = this.deps.viewModel.get();
    if (!currentNote) {
      throw new Error("App wasn't initialized!");
    }
    await this.deps.notesGateway.saveNote(id, currentNote.id, text);
    await this.refreshCurrentNote();
  };

  deleteNote = async (id: string) => {
    await this.deps.notesGateway.deleteNote(id);
    await this.refreshCurrentNote();
  };

  changeParent = async (id: string, newParentId: string) => {
    await this.deps.notesGateway.saveNote(id, newParentId);
    await this.refreshCurrentNote();
  };

  private async refreshCurrentNote() {
    const { currentNote } = this.deps.viewModel.get();
    if (!currentNote) {
      throw new Error("App wasn't initialized!");
    }
    const refreshedNote = await this.deps.notesGateway.getNote(currentNote.id);
    if (!refreshedNote) {
      throw new Error("TODO");
    }
    this.deps.viewModel.update({ currentNote: refreshedNote });
  }
}
