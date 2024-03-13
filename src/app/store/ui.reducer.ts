import { createReducer, on } from "@ngrx/store";
import * as UiAction from './ui.actions';

export const uiFeatureKey = 'ui';

export interface UiState {
  showTaskListSidebar: boolean,
}

export const initialUiState: UiState = {
  showTaskListSidebar: localStorage.getItem('showTaskListSidebar') === 'true',
};

export const uiReducer = createReducer(
  initialUiState,
  
  on(UiAction.changeTaskListSidebarVisibilitySuccess, (state, action) => {
    return { ...state, showTaskListSidebar: action.showTaskListSidebar };
  }),
)
