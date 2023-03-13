import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type FiltersState = {
  appliedFilters: string[];
  facesPreview: string[];
  areFacesLoading: boolean;
};

const initialState: FiltersState = {
  appliedFilters: [],
  facesPreview: [],
  areFacesLoading: false,
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    addFilter: (state, action: PayloadAction<string>) => {
      state.appliedFilters.push(action.payload);
      state.areFacesLoading = true;
    },
    removeFilter: (state, action: PayloadAction<string>) => {
      state.appliedFilters = state.appliedFilters.filter(
        (filter) => filter !== action.payload
      );
      state.areFacesLoading = true;
    },
    setFacesPreview: (state, action: PayloadAction<string[]>) => {
      state.facesPreview = action.payload;
      state.areFacesLoading = false;
    },
  },
});

export const { addFilter, removeFilter, setFacesPreview } =
  filtersSlice.actions;

export default filtersSlice.reducer;
