import { NoteView, ShortNote } from "../entities/notes";
import { NotesGateway } from "../gateways/notes.gateway";
import { createViewModelInteractorMock } from "../shared/lib/view-model-interactor-mock";
import { NotesController } from "./notes.controller-new";
import { NotesViewModel } from "./notes.view-model";

const MAIN_EMPTY_NOTE: NoteView = {
  id: "main",
  text: "Main",
  content: [],
};

const APP_NOT_INITIALIZED_ERROR = new Error("Notes weren't initialized!");

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

describe("Initialization", () => {
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

describe("Deleting child note", () => {
  it("should delete child note from main", async () => {
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

    await controller.deleteChildNote(CHILD_NOTE.id);

    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: MAIN_EMPTY_NOTE,
    });
  });
});
