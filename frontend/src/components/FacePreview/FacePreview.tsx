import { CloseIcon } from "@chakra-ui/icons";
import { Box, BoxProps, IconButton } from "@chakra-ui/react";

export type FacePreviewProps = BoxProps & {
  src: string;
  size?: number | string;
  onRemove?: () => void;
  colorScheme?: string;
};

export const FacePreview = ({
  src,
  size = "167px",
  onRemove,
  colorScheme,
  ...rest
}: FacePreviewProps) => {
  return (
    <Box position="relative" w="fit-content">
      {onRemove && colorScheme && (
        <IconButton
          bg={colorScheme}
          color="white"
          borderRadius="50%"
          size="sm"
          position="absolute"
          top={-4}
          right={-4}
          aria-label="delete"
          icon={<CloseIcon />}
        />
      )}
      <Box
        as="img"
        border={colorScheme ? `3px solid ${colorScheme}` : "none"}
        src={src}
        alt="face"
        w={size}
        h={size}
        minW={size}
        minH={size}
        borderRadius={6}
        {...rest}
      />
    </Box>
  );
};
