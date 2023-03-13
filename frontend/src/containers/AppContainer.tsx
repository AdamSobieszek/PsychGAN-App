import { Stepper } from "@/components/Stepper";
import { useTypedSelector } from "@/redux/hooks";
import { FiltersStep } from "./FiltersStep";
import { Flex, Grid, GridItem } from "@chakra-ui/react";

export const AppContainer = () => {
  const { step } = useTypedSelector((state) => state.steps);
  let component = null;

  switch (step) {
    case "Filters":
      component = <FiltersStep />;
      break;
    case "Manipulation":
      component = <div>manipulation</div>;
      break;
    case "Generate":
      component = <div>generate</div>;
      break;
  }

  return (
    <Grid templateRows="48px 1fr" w="full" minH="100vh">
      <GridItem>
        <Flex
          w="full"
          align={"center"}
          justify="center"
          py={2}
          position="absolute"
          shadow="lg"
        >
          <Stepper currentStep={step} />
        </Flex>
      </GridItem>

      <GridItem>{component}</GridItem>
    </Grid>
  );
};
