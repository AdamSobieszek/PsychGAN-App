import { Accordion, Box, Stack } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { AccordionItem } from "./AccordionItem";

const meta: Meta<typeof AccordionItem> = {
  title: "Components/AccordionItem",
  component: AccordionItem,
  decorators: [
    (Story) => (
      <Accordion allowMultiple>
        <Story />
      </Accordion>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AccordionItem>;

export const Default: Story = {
  args: {
    title: "Experimental design",
    children: (
      <Stack>
        <Box bg="palevioletred" w="100px" h="100px" />
        <Box bg="palevioletred" w="100px" h="100px" />
        <Box bg="palevioletred" w="100px" h="100px" />
      </Stack>
    ),
  },
};
