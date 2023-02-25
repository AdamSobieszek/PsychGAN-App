import type { Meta, StoryObj } from "@storybook/react";

import { AddFaceButton } from "./AddFaceButton";

const meta: Meta<typeof AddFaceButton> = {
  title: "Components/AddFaceButton",
  component: AddFaceButton,
};

export default meta;
type Story = StoryObj<typeof AddFaceButton>;

export const Default: Story = {
  args: {
    colorScheme: "#3EBBBB",
  },
};
