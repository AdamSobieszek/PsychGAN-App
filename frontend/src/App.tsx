import { Box, Flex, Heading } from "@chakra-ui/react";
import { Sidebar } from "./components/Sidebar";

const getAPIUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const url = urlParams.get("url");
  if (!url) {
    return null;
  }
  return decodeURIComponent(url);
};

function App() {
  return (
    <Flex w="100vw" h="100vh">
      <Sidebar />
      <Flex w="full" h="full" bg="#F7FAFC"></Flex>
    </Flex>
  );
}

export default App;
