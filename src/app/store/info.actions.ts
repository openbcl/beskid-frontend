import { createAction, props } from '@ngrx/store';
import { Info } from './info';

export const obtainInfo = createAction(
  '[Auth] Obtain Info'
);

export const obtainInfoSuccess = createAction(
  '[Auth] Obtain Info Success',
  props<{ info: Info }>()
);

export const obtainInfoFailure = createAction(
  '[Auth] Obtain Info Failure',
  props<{ error: any }>()
);