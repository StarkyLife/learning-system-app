import {
  InMemoryDbNote,
  InMemoryNotesGateway,
} from "../../../gateways/in-memory-notes.gateway";
import { createViewModelInteractorMock } from "../../../shared/lib/view-model-interactor-mock";
import { NotesController } from "../notes.controller";
import { NotesViewModel } from "../notes.view-model";
import { TestNote } from "./test-note";

const createController = (
  initialViewModel: NotesViewModel,
  initialGatewayNotes: InMemoryDbNote[] = []
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

const MAIN_NOTE = new TestNote({
  id: "main",
  text: "",
});
const CHILD_NOTE = new TestNote({
  id: "child-id",
  text: "",
  parentId: MAIN_NOTE.data.id,
});

it("should init view model with main note", async () => {
  const INITIAL_VIEW_MODEL: NotesViewModel = {
    currentNote: null,
  };

  const { controller, viewModelInteractorMock } =
    createController(INITIAL_VIEW_MODEL);

  await controller.init();

  expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
    currentNote: MAIN_NOTE.getNoteView(),
  });
});

describe("Adding new child note", () => {
  it("should throw an error if current note is not initialized", async () => {
    const APP_NOT_INITIALIZED_ERROR = new Error("Notes weren't initialized!");
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
      currentNote: MAIN_NOTE.getNoteView(),
    };

    const { controller, viewModelInteractorMock, notesGateway } =
      createController(INITIAL_VIEW_MODEL, [MAIN_NOTE.getDbNote()]);

    await controller.addChildNote();

    const expected = MAIN_NOTE.getNoteView([
      {
        id: expect.any(String),
        text: "",
      },
    ]);
    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: expected,
    });
    expect(await notesGateway.getMainNote()).toEqual(expected);
  });
});

describe("Saving child note's text", () => {
  it("should throw an error if child note was not found", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_NOTE.getNoteView(),
    };

    const { controller } = createController(INITIAL_VIEW_MODEL, [
      MAIN_NOTE.getDbNote(),
    ]);

    await expect(controller.saveChildNote("child-id", "text")).rejects.toEqual(
      new Error("Child note (id=child-id) wasn't found!")
    );
  });

  it("should save child text", async () => {
    const TEXT_TO_SAVE = "child note text to save";
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_NOTE.getNoteView([CHILD_NOTE.getShortNote()]),
    };

    const { controller, viewModelInteractorMock, notesGateway } =
      createController(INITIAL_VIEW_MODEL, [
        MAIN_NOTE.getDbNote([CHILD_NOTE.data.id]),
        CHILD_NOTE.getDbNote(),
      ]);

    await controller.saveChildNote(CHILD_NOTE.data.id, TEXT_TO_SAVE);

    const expected = MAIN_NOTE.getNoteView([
      {
        ...CHILD_NOTE.getShortNote(),
        text: TEXT_TO_SAVE,
      },
    ]);
    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: expected,
    });
    expect(await notesGateway.getMainNote()).toEqual(expected);
  });
});

describe("Deleting child note", () => {
  it("should delete child note and all it's content", async () => {
    const THIRD_LEVEL_NOTE = new TestNote({
      id: "third-level",
      text: "third level",
      parentId: CHILD_NOTE.data.id,
    });
    const FOURTH_LEVEL_NOTE = new TestNote({
      id: "fourth-level",
      text: "fourth level",
      parentId: THIRD_LEVEL_NOTE.data.id,
    });

    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_NOTE.getNoteView([CHILD_NOTE.getShortNote()]),
    };

    const { controller, viewModelInteractorMock, notesGateway } =
      createController(INITIAL_VIEW_MODEL, [
        MAIN_NOTE.getDbNote([CHILD_NOTE.data.id]),
        CHILD_NOTE.getDbNote([THIRD_LEVEL_NOTE.data.id]),
        THIRD_LEVEL_NOTE.getDbNote([FOURTH_LEVEL_NOTE.data.id]),
        FOURTH_LEVEL_NOTE.getDbNote(),
      ]);

    await controller.deleteChildNote(CHILD_NOTE.data.id);

    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: MAIN_NOTE.getNoteView(),
    });
    expect(await notesGateway.getMainNote()).toEqual(MAIN_NOTE.getNoteView());
    expect(await notesGateway.getNote(CHILD_NOTE.data.id)).toBeNull();
    expect(await notesGateway.getNote(THIRD_LEVEL_NOTE.data.id)).toBeNull();
    expect(await notesGateway.getNote(FOURTH_LEVEL_NOTE.data.id)).toBeNull();
  });
});

describe("Opening child content", () => {
  it("should throw an error if it can't find note with given id", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_NOTE.getNoteView(),
    };

    const { controller } = createController(INITIAL_VIEW_MODEL, [
      MAIN_NOTE.getDbNote(),
    ]);

    await expect(controller.openChildNote(CHILD_NOTE.data.id)).rejects.toEqual(
      new Error(`Couldn't find note with id = ${CHILD_NOTE.data.id}`)
    );
  });

  it("should open child note content", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_NOTE.getNoteView([CHILD_NOTE.getShortNote()]),
    };

    const { controller, viewModelInteractorMock } = createController(
      INITIAL_VIEW_MODEL,
      [MAIN_NOTE.getDbNote([CHILD_NOTE.data.id]), CHILD_NOTE.getDbNote()]
    );

    await controller.openChildNote(CHILD_NOTE.data.id);

    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: CHILD_NOTE.getNoteView(),
    });
  });
});

describe("Going back to upper levels", () => {
  it("should throw an error if the current note is the main one", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_NOTE.getNoteView(),
    };

    const { controller } = createController(INITIAL_VIEW_MODEL, [
      MAIN_NOTE.getDbNote(),
    ]);

    await expect(controller.goToUpperLevel()).rejects.toEqual(
      new Error("There is no upper level notes!")
    );
  });

  it("should throw an error if it can't find a note with the given id", async () => {
    const THIRD_LEVEL_NOTE = new TestNote({
      id: "third-level-child-id",
      text: "",
      parentId: CHILD_NOTE.data.id,
    });
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: THIRD_LEVEL_NOTE.getNoteView(),
    };

    const { controller } = createController(INITIAL_VIEW_MODEL, [
      MAIN_NOTE.getDbNote(),
      THIRD_LEVEL_NOTE.getDbNote(),
    ]);

    await expect(controller.goToUpperLevel()).rejects.toEqual(
      new Error(
        `Couldn't find note with id = ${THIRD_LEVEL_NOTE.data.parentId}`
      )
    );
  });

  it("should open parent note", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: CHILD_NOTE.getNoteView(),
    };

    const { controller, viewModelInteractorMock } = createController(
      INITIAL_VIEW_MODEL,
      [MAIN_NOTE.getDbNote([CHILD_NOTE.data.id]), CHILD_NOTE.getDbNote()]
    );

    await controller.goToUpperLevel();

    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: MAIN_NOTE.getNoteView([CHILD_NOTE.getShortNote()]),
    });
  });
});

describe("Change note's parent", () => {
  it("change parent inside main note", async () => {
    const NOTE_TO_MOVE = new TestNote({
      id: "note-to-move-id",
      text: "note to move text",
      parentId: MAIN_NOTE.data.id,
    });
    const NEW_PARENT_NOTE = new TestNote({
      id: "new-parent",
      text: "new parent text",
      parentId: MAIN_NOTE.data.id,
    });

    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_NOTE.getNoteView([
        NEW_PARENT_NOTE.getShortNote(),
        NOTE_TO_MOVE.getShortNote(),
      ]),
    };

    const { controller, viewModelInteractorMock, notesGateway } =
      createController(INITIAL_VIEW_MODEL, [
        MAIN_NOTE.getDbNote([NEW_PARENT_NOTE.data.id, NOTE_TO_MOVE.data.id]),
        NEW_PARENT_NOTE.getDbNote(),
        NOTE_TO_MOVE.getDbNote(),
      ]);

    await controller.changeNoteParent(
      NOTE_TO_MOVE.data.id,
      NEW_PARENT_NOTE.data.id
    );

    const expected = MAIN_NOTE.getNoteView([NEW_PARENT_NOTE.getShortNote()]);
    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: expected,
    });
    expect(await notesGateway.getMainNote()).toEqual(expected);
    expect(await notesGateway.getNote(NEW_PARENT_NOTE.data.id)).toEqual(
      NEW_PARENT_NOTE.getNoteView([NOTE_TO_MOVE.getShortNote()])
    );
  });
});

describe("Notes ordering", () => {
  it("should throw an error if passed nonexistent noteId", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_NOTE.getNoteView(),
    };

    const { controller } = createController(INITIAL_VIEW_MODEL, [
      MAIN_NOTE.getDbNote(),
    ]);

    await expect(
      controller.changeNotePosition(
        "some-random-id",
        "some-random-related-id",
        "up"
      )
    ).rejects.toEqual(
      new Error(
        `Can't move child note with ID = some-random-id. Reason: it doesn't exist in current parent note.`
      )
    );
  });

  it("should throw an error if passed nonexistent related note id", async () => {
    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_NOTE.getNoteView([CHILD_NOTE.getShortNote()]),
    };

    const { controller } = createController(INITIAL_VIEW_MODEL, [
      MAIN_NOTE.getDbNote([CHILD_NOTE.data.id]),
      CHILD_NOTE.getDbNote(),
    ]);

    await expect(
      controller.changeNotePosition(
        CHILD_NOTE.data.id,
        "some-random-related-id",
        "up"
      )
    ).rejects.toEqual(
      new Error(
        `Can't move child note with ID = ${CHILD_NOTE.data.id}. Reason: can't find related note with ID = some-random-related-id.`
      )
    );
  });

  // prettier-ignore
  it.each`
  position    | initial                       | movingNote  | relatedNote | result
  ${'up'}     | ${["1", "2", "3", "4", "5"]}  | ${'1'}      | ${'5'}      | ${["2", "3", "4", '1', '5']}
  ${'up'}     | ${["1", "2", "3", "4", "5"]}  | ${'5'}      | ${'1'}      | ${['5', '1', "2", "3", "4"]}
  ${'down'}   | ${["1", "2", "3", "4", "5"]}  | ${'1'}      | ${'5'}      | ${["2", "3", "4", '5', '1']}
  ${'down'}   | ${["1", "2", "3", "4", "5"]}  | ${'5'}      | ${'1'}      | ${['1', '5', "2", "3", "4"]}
  `("should move note $movingNote to the $position position related to $relatedNote", async ({
      position,
      initial,
      movingNote,
      relatedNote,
      result
  }: {
      position: 'up' | 'down';
      initial: string[];
      movingNote: string;
      relatedNote: string;
      result: string[]
  }) => {
    const createTestNote = (id: string) =>
      new TestNote({
        id,
        text: id,
        parentId: MAIN_NOTE.data.id,
      });

    const initialNotes = initial.map(createTestNote);

    const INITIAL_VIEW_MODEL: NotesViewModel = {
      currentNote: MAIN_NOTE.getNoteView(
        initialNotes.map((n) => n.getShortNote())
      ),
    };

    const { controller, viewModelInteractorMock, notesGateway } =
      createController(INITIAL_VIEW_MODEL, [
        MAIN_NOTE.getDbNote(initialNotes.map((n) => n.data.id)),
        ...initialNotes.map((n) => n.getDbNote()),
      ]);

    await controller.changeNotePosition(movingNote, relatedNote, position);

    const expected = MAIN_NOTE.getNoteView(
      result.map(createTestNote).map((n) => n.getShortNote())
    );
    expect(viewModelInteractorMock.get()).toEqual<NotesViewModel>({
      currentNote: expected,
    });
    expect(await notesGateway.getMainNote()).toEqual(expected);
  });
});
