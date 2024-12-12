import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InfoState, infoFeatureKey } from "./info.reducer";

export const getInfoState = createFeatureSelector<InfoState>(infoFeatureKey);

export const info = createSelector(
  getInfoState,
  infoState => infoState.info
);