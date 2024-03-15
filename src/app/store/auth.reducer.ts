import { createReducer, on } from "@ngrx/store";
import { Auth } from "./auth";
import * as AuthAction from './auth.actions';

export const authFeatureKey = 'auth';

export interface AuthState {
  auth?: Auth;
  isValid: boolean,
  ageInDays: number,
  error: any;
}

export const initialAuthState: AuthState = {
  auth: undefined,
  isValid: false,
  ageInDays: 0,
  error: null
};

export const authReducer = createReducer(
  initialAuthState,

  on(...[AuthAction.newSessionSuccess, AuthAction.renewSessionSuccess], (state, action) => {
    return { ...state, auth: action.auth };
  }),

  on(AuthAction.checkSessionSuccess, (state, action) => {
    return { ...state, auth: action.auth, isValid: action.isValid, ageInDays: action.ageInDays };
  }),

  on(AuthAction.deleteSessionSuccess, () => {
    return initialAuthState;
  }),

  on(...[AuthAction.newSessionFailure, AuthAction.renewSessionFailure, AuthAction.checkSessionFailure, AuthAction.deleteSessionFailure], (state, action) => {
    return { ...state, error: action.error };
  }),
)
