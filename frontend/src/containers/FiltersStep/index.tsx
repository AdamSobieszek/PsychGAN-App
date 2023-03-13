import { FiltersScreen } from "@/components/Filters";
import { useTypedSelector } from "@/redux/hooks";
import { addFilter, removeFilter } from "./slice";

export const FiltersStep = () => {
  const filtersState = useTypedSelector((state) => state.filters);

  return (
    <FiltersScreen
      areFacesLoading={filtersState.areFacesLoading}
      facesPreview={filtersState.facesPreview}
      filters={filtersState.appliedFilters}
      regenerateFaces={() => {
        console.log("TODO");
      }}
      addFilter={addFilter}
      removeFilter={removeFilter}
    />
  );
};
