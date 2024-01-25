import { createReducer, on } from "@ngrx/store";
import { Model } from "./model";
import * as ModelAction from './model.actions';

export const modelFeatureKey = 'models';

export interface ModelState {
  model?: Model;
  models: Model[],
  processing: boolean;
  error: any;
}

export const initialModelState: ModelState = {
  model: undefined,
  models: [],
  processing: false,
  error: null
};

export const modelReducer = createReducer(
  initialModelState,
  
  on(...[ModelAction.findModel, ModelAction.findModels], state => {
    return { ...state, processing: true };
  }),

  on(ModelAction.findModelSuccess, (state, action) => {
    return { ...state, model: action.model, processing: false };
  }),

  on(ModelAction.findModelsSuccess, (state, action) => {
    return { ...state, models: action.models, processing: false };
  }),

  on(...[ModelAction.findModelFailure, ModelAction.findModelsFailure], (state, action) => {
    return { ...state, error: action.error, processing: false };
  }),
)
