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

export const fdsVersions = createSelector(
  getModelState,
  modelState => [...new Set(modelState.models.map(model => model.fds).flat())]
    .filter((fdsValue, i, arr) => arr.findIndex(value => value.version === fdsValue.version) === i)
    .sort((a, b) => a.version < b.version ? -1 : 1)
);

export const experiments = createSelector(
  getModelState,
  modelState => [...new Set(modelState.models.map(model => model.experiments).flat())]
);