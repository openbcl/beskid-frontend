import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ModelState, modelFeatureKey } from "./model.reducer";
import { Experiment, Model } from "./model";
import { Task } from "./task";

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
  value: number,
  name: string,
  resolutions: number[]
}

export interface ExperimentOption {
  id: string,
  name: string,
  conditions: ExperimentConditionOption[]
}

export const compatibleModels = (task: Task) => createSelector(
  getModelState,
  modelState => modelState.models.filter(model => 
    task.condition.resolution === model.resolution &&
    model.experiments.find(e => e.id === task.condition.id && e.conditions.includes(task.condition.value))
  )
)

export const experimentOptions = createSelector(
  getModelState,
  modelState => {
    const newExperimentOption = (model: Model, experiment: Experiment): ExperimentOption => ({
      id: experiment.id,
      name: experiment.name,
      conditions: experiment.conditions.map(condition => ({
        value: condition,
        name: `${condition} ${experiment.conditionMU}`,
        resolutions: [model.resolution]
      }))
    })
    const experimentOptions = !!modelState.models?.length ?
      modelState.models[0].experiments.map(experiment => newExperimentOption(modelState.models[0], experiment)) : [];
    if (modelState.models?.length > 1) {
      modelState.models.slice(1).forEach(model => model.experiments.forEach(experiment => {
        const experimentOption = experimentOptions.find(expeimentOption => expeimentOption.id === experiment.id);
        if (!experimentOption) {
          experimentOptions.push(newExperimentOption(model, experiment))
        } else {
          experiment.conditions.forEach(condition => {
            const conditionR = experimentOption.conditions.find(conditionR => conditionR.value === condition);
            if (!conditionR) {
              experimentOption.conditions.push({
                value: condition,
                name: `${condition} ${experiment.conditionMU}`,
                resolutions: [model.resolution]
              })
            } else if (!conditionR.resolutions.includes(model.resolution)) {
              conditionR.resolutions.push(model.resolution);
            }
          })
        }
      }));
    }
    return experimentOptions;
  }
);