import { Button, Container, Heading, HStack, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function LandingPage() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>PsychGenApp</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container as="main" mt={32} maxW="3xl">
        <Heading mb={4}>
          Easily generate face data for your next experiment
        </Heading>

        <Text mb={4} fontWeight="medium" fontSize={18}>
          PsychGenApp is an open source web application that allows you to
          generate face data for your next experiment. In the near future, we
          will make this subheading more interesting.
        </Text>

        <HStack>
          <Button
            size="lg"
            colorScheme="teal"
            onClick={() => router.push("/app/?api_url=http://localhost:5000")}
          >
            Get Started
          </Button>
          <Button size="lg" colorScheme="teal" variant="outline">
            Learn More
          </Button>
        </HStack>
      </Container>
    </>
  );
}
