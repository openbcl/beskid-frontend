import { createAction, props } from '@ngrx/store';

export const toastSuccess = createAction(
  '[ToastMessage] Toast Success Message',
  props<{ summary: string, detail?: string }>()
);

export const toastInfo = createAction(
  '[ToastMessage] Toast Info Message',
  props<{ summary: string, detail?: string }>()
);

export const toastWarn = createAction(
  '[ToastMessage] Toast Warn Message',
  props<{ summary: string, detail?: string }>()
);

export const toastError = createAction(
  '[ToastMessage] Toast Error Message',
  props<{ summary: string, detail?: string }>()
);