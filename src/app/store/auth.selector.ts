import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState, authFeatureKey } from "./auth.reducer";

export const getAuthState = createFeatureSelector<AuthState>(authFeatureKey);

export const auth = createSelector(
  getAuthState,
  authState => authState.auth
);

export const isValid = createSelector(
  getAuthState,
  authState => authState.isValid
);

export const validityPeriodInDays = createSelector(
  getAuthState,
  authState => authState.validityPeriodInDays
);