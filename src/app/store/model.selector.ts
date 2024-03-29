import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ModelState, modelFeatureKey } from "./model.reducer";

export const getModelState = createFeatureSelector<ModelState>(modelFeatureKey);

export const model = createSelector(
  getModelState,
  modelState => modelState.model
);

export const models = createSelector(
  getModelState,
  modelState => modelState.models
);