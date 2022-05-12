export type ViewModelInteractor<ViewModel> = {
  update(viewModel: Partial<ViewModel>): void;
  get(): ViewModel;
};

type ViewModelSetFn<ViewModel> = (
  updater: (prev: ViewModel) => ViewModel
) => void;

export const createViewModelInteractor = <ViewModel>(
  viewModel: ViewModel,
  presenter: ViewModelSetFn<ViewModel>
): ViewModelInteractor<ViewModel> => ({
  update: (newViewModel) => {
    presenter((prev) => ({ ...prev, ...newViewModel }));
  },
  get: () => viewModel,
});
