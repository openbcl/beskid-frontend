import { createAction, props } from '@ngrx/store';

export const changeTaskListSidebarVisibility = createAction(
  '[UI] Change Task List Sidebar Visibility'
);

export const changeTaskListSidebarVisibilitySuccess = createAction(
  '[UI] Change Task List Sidebar Visibility Success',
  props<{ showTaskListSidebar: boolean }>()
);

export const changeTaskListSidebarVisibilityFailure = createAction(
  '[UI] Change Task List Sidebar Visibility Failure',
  props<{ error: any }>()
);