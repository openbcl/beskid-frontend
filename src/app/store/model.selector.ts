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
  modelState => [...new Set(modelState.models.map(model => model.fds))]
    .filter(value => !!value)
    .filter((fdsValue, i, arr) => arr.findIndex(value => value && fdsValue && value.version === fdsValue.version) === i)
    .sort((a, b) => !!a && !!b && a.version < b.version ? -1 : 1)
);

export const experiments = createSelector(
  getModelState,
  modelState => {
    const experiments = !!modelState.models?.length ? modelState.models[0].experiments.map(experiment => ({
      id: experiment.id,
      name: experiment.name,
      conditions: experiment.conditions,
      resolution: modelState.models[0].resolution,
    })) : [];
    if (modelState.models?.length > 1) {
      //TODO
    }
    return experiments;
  }
);