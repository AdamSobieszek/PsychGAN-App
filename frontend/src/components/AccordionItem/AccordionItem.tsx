import {
  AccordionItem as ChakraAccordionItem,
  AccordionItemProps,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

export type CollapsableSectionProps = AccordionItemProps & {
  title: string;
  children: ReactNode;
};

export const AccordionItem = ({
  title,
  children,
  ...rest
}: CollapsableSectionProps) => {
  return (
    <ChakraAccordionItem border="none" {...rest}>
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
