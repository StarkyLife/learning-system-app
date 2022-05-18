import { NoteView, ShortNote } from "../entities/notes";
import { NotesGateway } from "../gateways/notes.gateway";
import { createViewModelInteractorMock } from "../shared/lib/view-model-interactor-mock";
import { NotesController } from "./notes.controller-new";
import { NotesViewModel } from "./notes.view-model";

// TODO:
// - change parent
// - save, delete in Gateway
// - change content ordering

const createController = (
  initialViewModel: NotesViewModel,
  deps: {
    notesGateway?: Partial<NotesGateway>;
  } = {}
) => {
  const viewModelInteractorMock =
    createViewModelInteractorMock(initialViewModel);

  const notesGatewayMock: NotesGateway = {
    getMainNote: deps.notesGateway?.getMainNote || jest.fn(),
    getNote: deps.notesGateway?.getNote || jest.fn(),
    saveNote: deps.notesGateway?.saveNote || jest.fn(),
    createNewNote: deps.notesGateway?.createNewNote || jest.fn(),
    deleteNote: deps.notesGateway?.deleteNote || jest.fn(),
  };

  const controller = new NotesController().setDependencies({
    viewModel: viewModelInteractorMock,
    notesGateway: notesGatewayMock,
  });

  return { controller, viewModelInteractorMock, notesGatewayMock };
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
  const getMainNoteMock = jest.fn().mockResolvedValue(MAIN_EMPTY_NOTE);

  const { controller, viewModelInteractorMock } = createController(
    INITIAL_VIEW_MODEL,
    {
      notesGateway: {
        getMainNote: getMainNoteMock,
      },
    }
  );

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
      currentNote: {
        ...MAIN_EMPTY_NOTE,
        content: [SHORT_CHILD_NOTE],
      },
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
    currentNote: {
      ...MAIN_EMPTY_NOTE,
      content: [SHORT_CHILD_NOTE],
    },
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
    const getNoteMock = jest.fn().mockResolvedValue(null);

    const { controller } = createController(INITIAL_VIEW_MODEL, {
      notesGateway: {
        getNote: getNoteMock,
      },
    });

    await expect(controller.openChildNote(CHILD_NOTE.id)).rejects.toEqual(
      new Error(`Couldn't find note with id = ${CHILD_NOTE.id}`)
    );
  });

  it("should open child note content", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_EMPTY_NOTE,
    };
    const getNoteMock = jest.fn().mockResolvedValue(CHILD_NOTE);

    const { controller, viewModelInteractorMock } = createController(
      INITIAL_VIEW_MODEL,
      {
        notesGateway: {
          getNote: getNoteMock,
        },
      }
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
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: CHILD_NOTE,
    };
    const getNoteMock = jest.fn().mockResolvedValue(null);

    const { controller } = createController(INITIAL_VIEW_MODEL, {
      notesGateway: {
        getNote: getNoteMock,
      },
    });

    await expect(controller.goToUpperLevel()).rejects.toEqual(
      new Error(`Couldn't find note with id = ${CHILD_NOTE.parentId}`)
    );
  });

  it("should open parent note", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: CHILD_NOTE,
    };
    const getNoteMock = jest.fn().mockResolvedValue(MAIN_EMPTY_NOTE);

    const { controller, viewModelInteractorMock } = createController(
      INITIAL_VIEW_MODEL,
      {
        notesGateway: {
          getNote: getNoteMock,
        },
      }
    );

    await controller.goToUpperLevel();

    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: MAIN_EMPTY_NOTE,
    });
  });
});
