import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ModelState, modelFeatureKey } from "./model.reducer";
import { Experiment, Model } from "./model";
import { Task } from "./task";
import { map, Observable } from "rxjs";

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

export interface ExperimentConditionOption {
  id: string,
  label: string,
  values: {
    value: number,
    resolutions: number[]
  }[]
}

export interface ExperimentOption {
  id: string,
  name: string,
  conditions: ExperimentConditionOption[]
}

export const compatibleModels$ = (task$: Observable<Task>) => createSelector(
  getModelState,
  modelState => task$.pipe(
    map(task => modelState.models.filter(model => {
      if (task.setting.resolution !== model.resolution) {
        return false;
      }
      const experiment = model.experiments.find(e => e.id === task.setting.id);
      if (!experiment) {
        return false;
      }
      const selectedConditions = task.setting.conditions || {};
      const expectedConditionIds = experiment.conditions.map((condition) => condition.id);
      return (
        expectedConditionIds.every((conditionId) => conditionId in selectedConditions) &&
        Object.entries(selectedConditions).every(([conditionId, value]) =>
          !!experiment.conditions.find((condition) => condition.id === conditionId && condition.values.includes(value))
        )
      );
    }))
  )
)

export const experimentOptions = createSelector(
  getModelState,
  modelState => {
    const newExperimentOption = (model: Model, experiment: Experiment): ExperimentOption => ({
      id: experiment.id,
      name: experiment.name,
      conditions: experiment.conditions.map(condition => ({
        id: condition.id,
        label: condition.label,
        values: condition.values.map(value => ({
          value,
          resolutions: [model.resolution]
        }))
      }))
    });

    const experimentOptions = !!modelState.models?.length ?
      modelState.models[0].experiments.map(experiment => newExperimentOption(modelState.models[0], experiment)) : [];

    if (modelState.models?.length > 1) {
      modelState.models.slice(1).forEach(model => model.experiments.forEach(experiment => {
        const experimentOption = experimentOptions.find(expeimentOption => expeimentOption.id === experiment.id);
        if (!experimentOption) {
          experimentOptions.push(newExperimentOption(model, experiment));
        } else {
          experiment.conditions.forEach(condition => {
            const conditionOption = experimentOption.conditions.find(conditionOption => conditionOption.id === condition.id);
            if (!conditionOption) {
              experimentOption.conditions.push({
                id: condition.id,
                label: condition.label,
                values: condition.values.map(value => ({
                  value,
                  resolutions: [model.resolution]
                }))
              });
            } else {
              condition.values.forEach(value => {
                const valueOption = conditionOption.values.find((conditionValue) => conditionValue.value === value);
                if (!valueOption) {
                  conditionOption.values.push({
                    value,
                    resolutions: [model.resolution]
                  });
                } else if (!valueOption.resolutions.includes(model.resolution)) {
                  valueOption.resolutions.push(model.resolution);
                }
              });
            }
          });
        }
      }));
    }

    return experimentOptions.map(experimentOption => ({
      ...experimentOption,
      conditions: experimentOption.conditions
        .map((conditionOption) => ({
          ...conditionOption,
          values: conditionOption.values.sort((a, b) => a.value - b.value)
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
    }));
  }
);
