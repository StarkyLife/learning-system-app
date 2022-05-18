import { NoteView, ShortNote } from "../entities/notes";
import { createViewModelInteractorMock } from "../shared/lib/view-model-interactor-mock";
import { NotesController } from "./notes.controller-new";
import { NotesViewModel } from "./notes.view-model";

const MAIN_EMPTY_NOTE: NoteView = {
  id: "main",
  text: "Main",
  content: [],
};

const APP_NOT_INITIALIZED_ERROR = new Error("Notes weren't initialized!");

const createController = (initialViewModel: NotesViewModel) => {
  const viewModelInteractorMock =
    createViewModelInteractorMock(initialViewModel);
  const controller = new NotesController().setDependencies({
    viewModel: viewModelInteractorMock,
  });

  return { controller, viewModelInteractorMock };
};

describe("Initialization", () => {
  it("should init view model with main note", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: null,
    };

    const { controller, viewModelInteractorMock } =
      createController(INITIAL_VIEW_MODEL);

    await controller.init();

    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: MAIN_EMPTY_NOTE,
    });
  });
});

describe("Adding new child note", () => {
  it("should throw an error if current note is not initialized", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: null,
    };

    const { controller } = createController(INITIAL_VIEW_MODEL);

    await expect(controller.addChildNote()).rejects.toEqual(
      APP_NOT_INITIALIZED_ERROR
    );
  });

  it("should add new note to main", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_EMPTY_NOTE,
    };

    const { controller, viewModelInteractorMock } =
      createController(INITIAL_VIEW_MODEL);

    await controller.addChildNote();

    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: {
        ...MAIN_EMPTY_NOTE,
        content: [
          {
            id: expect.any(String),
            text: "",
          },
        ],
      },
    });
  });
});

describe("Saving child note's text", () => {
  it("should throw an error if current note is not initialized", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: null,
    };

    const { controller } = createController(INITIAL_VIEW_MODEL);

    await expect(controller.saveChildNote("id", "text")).rejects.toEqual(
      APP_NOT_INITIALIZED_ERROR
    );
  });

  it("should throw an error if child note was not found", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_EMPTY_NOTE,
    };

    const { controller } = createController(INITIAL_VIEW_MODEL);

    await expect(controller.saveChildNote("child-id", "text")).rejects.toEqual(
      new Error("Child note (id=child-id) wasn't found!")
    );
  });

  it("should save child text", async () => {
    const TEXT_TO_SAVE = "child note text to save";
    const CHILD_NOTE: ShortNote = {
      id: "child-id",
      text: "",
    };
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: {
        ...MAIN_EMPTY_NOTE,
        content: [CHILD_NOTE],
      },
    };

    const { controller, viewModelInteractorMock } =
      createController(INITIAL_VIEW_MODEL);

    await controller.saveChildNote(CHILD_NOTE.id, TEXT_TO_SAVE);

    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: {
        ...MAIN_EMPTY_NOTE,
        content: [
          {
            ...CHILD_NOTE,
            text: TEXT_TO_SAVE,
          },
        ],
      },
    });
  });
});
