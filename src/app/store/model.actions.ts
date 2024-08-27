import { createAction, props } from '@ngrx/store';
import { Model } from './model';

export const findModel = createAction(
  '[Model] Find Model',
  props<{ modelId: number }>()
);

export const findModelSuccess = createAction(
  '[Model] Find Model Success',
  props<{ model: Model }>()
);

export const findModelFailure = createAction(
  '[Model] Find Model Failure',
  props<{ error: any }>()
);

export const findModels = createAction(
  '[Model] Find Models',
  props<{ fdsVersion?: string, experimentID?: string }>()
);

export const findModelsSuccess = createAction(
  '[Model] Find Models Success',
  props<{ models: Model[] }>()
);

export const findModelsFailure = createAction(
  '[Model] Find Models Failure',
  props<{ error: any }>()
);
