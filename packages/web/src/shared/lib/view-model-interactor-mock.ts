import { ViewModelInteractor } from "./view-model-interactor";

export const createViewModelInteractorMock = <ViewModel>(
  initialViewModel: ViewModel
): ViewModelInteractor<ViewModel> => {
  let localState = initialViewModel;

  return {
    get: () => localState,
    update: (newViewModel) => {
      localState = { ...localState, ...newViewModel };
    },
  };
};
