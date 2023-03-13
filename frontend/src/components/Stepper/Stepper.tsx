import { StepName, steps } from "@/constants";
import {
  Center,
  Flex,
  FlexProps,
  HStack,
  StackProps,
  Text,
} from "@chakra-ui/react";

type StepProps = FlexProps & {
  isActive: boolean;
  stepName: StepName;
};

const Step = ({ isActive, stepName, ...rest }: StepProps) => (
  <Flex align="center" {...rest}>
    <Center
      mr={3}
      borderRadius={"50%"}
      bg={isActive ? "teal.500" : "gray.500"}
      color="white"
      w="32px"
      h="32px"
    >
      {steps.indexOf(stepName) + 1}
    </Center>
    <Text color={isActive ? "black" : "GrayText"}>{stepName}</Text>
  </Flex>
);

export type StepperProps = StackProps & {
  currentStep: StepName;
};

export const Stepper = ({ currentStep, ...rest }: StepperProps) => {
  return (
    <HStack spacing={12} {...rest}>
      {steps.map((stepName) => (
        <Step
          key={stepName}
          isActive={stepName === currentStep}
          stepName={stepName}
        />
      ))}
    </HStack>
  );
};
