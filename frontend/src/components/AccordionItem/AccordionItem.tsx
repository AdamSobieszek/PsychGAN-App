import {
  Accordion,
  AccordionItem as ChakraAccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  AccordionProps,
} from "@chakra-ui/react";

export type CollapsableSectionProps = AccordionProps & {
  title: string;
  children: React.ReactNode;
};

export const AccordionItem = ({
  title,
  children,
  ...rest
}: CollapsableSectionProps) => {
  return (
    <ChakraAccordionItem border="none">
      <h2>
        <AccordionButton>
          <Box
            as="span"
            fontWeight="semibold"
            fontSize={20}
            flex="1"
            textAlign="left"
            color="#4A5568"
          >
            {title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel>{children}</AccordionPanel>
    </ChakraAccordionItem>
  );
};
