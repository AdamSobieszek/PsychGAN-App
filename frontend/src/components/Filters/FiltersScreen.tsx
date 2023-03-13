import { RepeatIcon } from "@chakra-ui/icons";
import { Button, Flex, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import { DEFAULT_FACE_SIZE, FacePreview } from "../FacePreview";

type Filter = string;

export type FiltersScreenProps = {
  filters: Filter[];
  addFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
  facesPreview: string[];
  regenerateFaces: () => void;
  areFacesLoading: boolean;
};

const facesSkeletons = new Array(9)
  .fill(0)
  .map((_, idx) => (
    <Skeleton
      key={idx}
      w={DEFAULT_FACE_SIZE}
      h={DEFAULT_FACE_SIZE}
      borderRadius={6}
    />
  ));

export const FiltersScreen = ({
  filters,
  facesPreview,
  regenerateFaces,
  areFacesLoading,
}: FiltersScreenProps) => {
  return (
    <Flex minW="100vw" minH="full" bg="#F7FAFC">
      <Flex
        color={"#4A5568"}
        direction="column"
        w="392px"
        minH="full"
        mt={8}
        borderTopRightRadius={24}
        bg="white"
        shadow="4px 0px 4px rgba(0, 0, 0, 0.25)"
        p={2}
      >
        filters: {filters}
      </Flex>

      <Flex minH="full" w="full" justify="center" align="center">
        <Flex direction="column">
          {facesPreview.length === 0 ? (
            <Text>Select some filters to see the preview</Text>
          ) : (
            <SimpleGrid columns={3} spacing={8}>
              {areFacesLoading
                ? facesSkeletons
                : facesPreview.map((face, idx) => (
                    <FacePreview key={idx} src={face} />
                  ))}
            </SimpleGrid>
          )}

          <Flex w="full" justify="center">
            <Button leftIcon={<RepeatIcon />} mt={6} onClick={regenerateFaces}>
              Regenerate
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
