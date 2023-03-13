import { createSlice } from "@reduxjs/toolkit";
import type { StepName } from "@/constants";

export type StepsState = {
  step: StepName;
};

const initialState: StepsState = {
  step: "Filters",
};

export const stepsSlice = createSlice({
  name: "steps",
  initialState,
  reducers: {
    goForward: (state) => {
      switch (state.step) {
        case "Filters":
          state.step = "Manipulation";
          break;
        case "Manipulation":
          state.step = "Generate";
          break;
        default:
          break;
      }
    },
    goBack: (state) => {
      switch (state.step) {
        case "Manipulation":
          state.step = "Filters";
          break;
        case "Generate":
          state.step = "Manipulation";
          break;
        default:
          break;
      }
    },
  },
});

export const { goBack, goForward } = stepsSlice.actions;

export default stepsSlice.reducer;
