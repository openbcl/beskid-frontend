import { createReducer, on } from "@ngrx/store";
import { Model } from "./model";
import * as ModelAction from './model.actions';

export const modelFeatureKey = 'models';

export interface ModelState {
  model?: Model;
  models: Model[],
  error: any;
}

export const initialModelState: ModelState = {
  model: undefined,
  models: [],
  error: null
};

export const modelReducer = createReducer(
  initialModelState,

  on(ModelAction.findModelSuccess, (state, action) => {
    return { ...state, model: action.model };
  }),

  on(ModelAction.findModelsSuccess, (state, action) => {
    return { ...state, models: action.models };
  }),

  on(...[ModelAction.findModelFailure, ModelAction.findModelsFailure], (state, action) => {
    return { ...state, error: action.error };
  }),
)
