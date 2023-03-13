export const steps = ["Filters", "Manipulation", "Generate"] as const;
export type StepName = (typeof steps)[number];
