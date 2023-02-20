import {
  Text,
  Flex,
  Accordion,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from "@chakra-ui/react";
import { AccordionItem } from "../AccordionItem";

export const Sidebar = () => {
  return (
    <Flex
      color={"#4A5568"}
      direction="column"
      position="absolute"
      w="392px"
      h="full"
      bg="white"
      shadow="4px 0px 4px rgba(0, 0, 0, 0.25)"
    >
      <Text fontSize={20} fontWeight="semibold" mb={12} p={4}>
        PsychoGenApp
      </Text>

      <Accordion allowMultiple defaultIndex={[0, 1, 2]}>
        <AccordionItem title="Experimental design">yo</AccordionItem>

        <AccordionItem title="Filters">
          <Text fontSize={14} mb={4}>
            Set rules that all generated images must satisfy.
          </Text>
        </AccordionItem>

        <AccordionItem title="Export">
          <Text fontSize={14} mb={4}>
            Number of images to generate <b>for each condition</b>
          </Text>

          <NumberInput>
            <NumberInputField borderRadius={3} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Text fontSize={12} mt={2}>
            A total of <b>TODO</b> images will be generated
          </Text>

          <Flex justify="center" mt={6}>
            <Button>Generate dataset</Button>
          </Flex>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};
