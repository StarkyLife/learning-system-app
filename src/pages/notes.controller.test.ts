import { NoteView, ShortNote } from "../entities/notes";
import { InMemoryNotesGateway } from "../gateways/in-memory-notes.gateway";
import { createViewModelInteractorMock } from "../shared/lib/view-model-interactor-mock";
import { NotesController } from "./notes.controller";
import { NotesViewModel } from "./notes.view-model";

// TODO:
// - save, delete in Gateway
// - change parent
// - change content ordering

const createController = (
  initialViewModel: NotesViewModel,
  initialGatewayNotes: NoteView[] = []
) => {
  const viewModelInteractorMock =
    createViewModelInteractorMock(initialViewModel);

  const notesGateway = new InMemoryNotesGateway(initialGatewayNotes);

  const controller = new NotesController().setDependencies({
    viewModel: viewModelInteractorMock,
    notesGateway,
  });

  return { controller, viewModelInteractorMock, notesGateway };
};

const MAIN_EMPTY_NOTE: NoteView = {
  id: "main",
  text: "Main",
  content: [],
};
const SHORT_CHILD_NOTE: ShortNote = {
  id: "child-id",
  text: "",
};
const MAIN_NOTE_WITH_CHILD: NoteView = {
  ...MAIN_EMPTY_NOTE,
  content: [SHORT_CHILD_NOTE],
};
const CHILD_NOTE: NoteView = {
  ...SHORT_CHILD_NOTE,
  parentId: MAIN_EMPTY_NOTE.id,
  content: [],
};

const APP_NOT_INITIALIZED_ERROR = new Error("Notes weren't initialized!");

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
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_NOTE_WITH_CHILD,
    };

    const { controller, viewModelInteractorMock } =
      createController(INITIAL_VIEW_MODEL);

    await controller.saveChildNote(SHORT_CHILD_NOTE.id, TEXT_TO_SAVE);

    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: {
        ...MAIN_EMPTY_NOTE,
        content: [
          {
            ...SHORT_CHILD_NOTE,
            text: TEXT_TO_SAVE,
          },
        ],
      },
    });
  });
});

it("should delete child note from main", async () => {
  const INITIAL_VIEW_MODEL: NotesViewModel = {
    currentNote: MAIN_NOTE_WITH_CHILD,
  };

  const { controller, viewModelInteractorMock } =
    createController(INITIAL_VIEW_MODEL);

  await controller.deleteChildNote(SHORT_CHILD_NOTE.id);

  expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
    currentNote: MAIN_EMPTY_NOTE,
  });
});

describe("Opening child content", () => {
  it("should throw an error if it can't find note with given id", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_EMPTY_NOTE,
    };

    const { controller } = createController(INITIAL_VIEW_MODEL);

    await expect(controller.openChildNote(CHILD_NOTE.id)).rejects.toEqual(
      new Error(`Couldn't find note with id = ${CHILD_NOTE.id}`)
    );
  });

  it("should open child note content", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_NOTE_WITH_CHILD,
    };

    const { controller, viewModelInteractorMock } = createController(
      INITIAL_VIEW_MODEL,
      [CHILD_NOTE]
    );

    await controller.openChildNote(CHILD_NOTE.id);

    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: CHILD_NOTE,
    });
  });
});

describe("Going back to upper levels", () => {
  it("should throw an error if the current note is the main one", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_EMPTY_NOTE,
    };

    const { controller } = createController(INITIAL_VIEW_MODEL);

    await expect(controller.goToUpperLevel()).rejects.toEqual(
      new Error("There is no upper level notes!")
    );
  });

  it("should throw an error if it can't find note with given id", async () => {
    const THIRD_LEVEL_NOTE: NoteView = {
      id: "third-level-child-id",
      text: "",
      parentId: CHILD_NOTE.id,
      content: [],
    };
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: THIRD_LEVEL_NOTE,
    };

    const { controller } = createController(INITIAL_VIEW_MODEL, [
      THIRD_LEVEL_NOTE,
    ]);

    await expect(controller.goToUpperLevel()).rejects.toEqual(
      new Error(`Couldn't find note with id = ${THIRD_LEVEL_NOTE.parentId}`)
    );
  });

  it("should open parent note", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: CHILD_NOTE,
    };

    const { controller, viewModelInteractorMock } = createController(
      INITIAL_VIEW_MODEL,
      [CHILD_NOTE]
    );

    await controller.goToUpperLevel();

    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: MAIN_NOTE_WITH_CHILD,
    });
  });
});
