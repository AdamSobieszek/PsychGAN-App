import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import { Stepper } from "./Stepper";

export default {
  title: "Components/Stepper",
  component: Stepper,
  args: {
    currentStep: "Filters",
  },
} as ComponentMeta<typeof Stepper>;

const Template: ComponentStory<typeof Stepper> = (args) => (
  <Stepper {...args} />
);

export const Story = Template.bind({});
Story.args = {};
