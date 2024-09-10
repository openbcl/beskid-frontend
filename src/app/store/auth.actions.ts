import { createAction, props } from '@ngrx/store';
import { Auth } from './auth';

export const newSession = createAction(
  '[Auth] New Session'
);

export const newSessionSuccess = createAction(
  '[Auth] New Session Success',
  props<{ auth: Auth }>()
);

export const newSessionFailure = createAction(
  '[Auth] New Session Failure',
  props<{ error: any }>()
);

export const renewSession = createAction(
  '[Auth] Renew Session',
  props<{ auth?: Auth }>()
);

export const renewSessionSuccess = createAction(
  '[Auth] Renew Session Success',
  props<{ auth: Auth }>()
);

export const renewSessionFailure = createAction(
  '[Auth] Renew Session Failure',
  props<{ error: any }>()
);

export const checkSession = createAction(
  '[Auth] Check Session Token'
);

export const checkSessionSuccess = createAction(
  '[Auth] Check Session Token Success',
  props<{ auth: Auth, isValid: boolean, ageInDays: number, validityPeriodInDays: number }>()
)

export const checkSessionFailure = createAction(
  '[Auth] Check Session Token Failure',
  props<{ error: any }>()
)

export const deleteSession = createAction(
  '[Auth] Delete Session'
);

export const deleteSessionSuccess = createAction(
  '[Auth] Delete Session Success'
);

export const deleteSessionFailure = createAction(
  '[Auth] Delete Session Failure',
  props<{ error: any }>()
);
