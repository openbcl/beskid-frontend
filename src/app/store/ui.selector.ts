import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UiState, uiFeatureKey } from "./ui.reducer";

export const getUiState = createFeatureSelector<UiState>(uiFeatureKey);

export const uiState = createSelector(
  getUiState,
  uiState => ({
    showTaskListSidebar: uiState.showTaskListSidebar,
    processing: uiState.processing
  })
);
