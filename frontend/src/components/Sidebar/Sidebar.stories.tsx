import { Box } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { Sidebar } from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  decorators: [
    (Story) => (
      <Box w="100vw" h="100vh" bg="gray.100">
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {},
};
