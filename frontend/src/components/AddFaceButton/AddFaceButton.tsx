import { AddIcon } from "@chakra-ui/icons";
import { IconButton, IconButtonProps } from "@chakra-ui/react";

export type AddFaceButtonProps = Omit<IconButtonProps, "aria-label"> & {
  colorScheme?: string;
};

export const AddFaceButton = ({ colorScheme, ...rest }: AddFaceButtonProps) => {
  return (
    <IconButton
      bg={colorScheme}
      color="white"
      opacity={0.68}
      aria-label="add"
      icon={<AddIcon />}
      {...rest}
    />
  );
};
