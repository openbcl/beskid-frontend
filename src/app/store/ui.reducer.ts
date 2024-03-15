import { createReducer, on } from "@ngrx/store";
import * as UiAction from './ui.actions';

export const uiFeatureKey = 'ui';

export interface UiState {
  showTaskListSidebar: boolean,
  processingIDs: string[];
  processing: boolean
}

export const initialUiState: UiState = {
  showTaskListSidebar: localStorage.getItem('showTaskListSidebar') === 'true',
  processingIDs: [],
  processing: false
};

export const uiReducer = createReducer(
  initialUiState,

  on(UiAction.startProcessing, (state, action) => {
    return { ...state, processingIDs: [ ...state.processingIDs, action.id ], processing: true }
  }),

  on(UiAction.finishProcessing, (state, action) => {
    const processingIDs = [ ...state.processingIDs.filter(id => id !== action.id) ];
    return { ...state, processingIDs, processing: !!processingIDs.length }
  }),
  
  on(UiAction.changeTaskListSidebarVisibilitySuccess, (state, action) => {
    return { ...state, showTaskListSidebar: action.showTaskListSidebar };
  }),
)
