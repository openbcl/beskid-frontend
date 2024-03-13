import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UiState, uiFeatureKey } from "./ui.reducer";

export const getUiState = createFeatureSelector<UiState>(uiFeatureKey);

export const showTaskListSidebar = createSelector(
  getUiState,
  uiState => uiState.showTaskListSidebar
);
