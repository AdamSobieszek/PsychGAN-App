import type { Meta } from "@storybook/react";
import { useState } from "react";

import { Variable } from "./Variable";

const meta: Meta<typeof Variable> = {
  title: "Components/Variable",
  component: Variable,
};

export default meta;

export const Default = () => {
  const [chosenVariable, setChosenVariable] = useState("Dominance");
  const [variableStrength, setVariableStrength] = useState(50);

  return (
    <Variable
      allVariables={["Dominance", "Trustworthiness", "Electability"]}
      chosenVariable={chosenVariable}
      variableStrength={variableStrength}
      colorScheme="#3EBBBB"
      onVariableChange={setChosenVariable}
      onVariableStrengthChange={setVariableStrength}
    />
  );
};
