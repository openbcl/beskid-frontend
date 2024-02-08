import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState, authFeatureKey } from "./auth.reducer";

export const getAuthState = createFeatureSelector<AuthState>(authFeatureKey);

export const authProcessing = createSelector(
  getAuthState,
  authState => authState.processing
);

export const auth = createSelector(
  getAuthState,
  authState => authState.auth
);