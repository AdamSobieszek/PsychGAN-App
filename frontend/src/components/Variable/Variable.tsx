import {
  Flex,
  FormControl,
  FormLabel,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";

export type VariableProps = {
  allVariables: string[];
  chosenVariable: string;
  variableStrength: number; // between 0 and 100
  colorScheme: string;
  onVariableChange: (variable: string) => void;
  onVariableStrengthChange: (variableStrength: number) => void;
};

export const Variable = ({
  allVariables,
  chosenVariable,
  variableStrength,
  colorScheme,
  onVariableChange,
  onVariableStrengthChange,
}: VariableProps) => {
  return (
    <Flex
      direction="column"
      border={`2px solid ${colorScheme}`}
      borderRadius={6}
      p={4}
    >
      <FormControl>
        <FormLabel>Variable name</FormLabel>
        <Select
          onChange={(e) => {
            onVariableChange(e.target.value);
          }}
          value={chosenVariable}
        >
          {allVariables.map((variable) => (
            <option key={variable} value={variable}>
              {variable}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Variable strength</FormLabel>
        <Slider
          aria-label="slider-ex-1"
          value={variableStrength}
          onChange={onVariableStrengthChange}
        >
          <SliderTrack>
            <SliderFilledTrack bg="#1E1E1E" />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>
    </Flex>
  );
};
