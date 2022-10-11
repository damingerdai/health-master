import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { Siderbar } from "../components/sidebar";

const Home: NextPage = () => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <title>Health Master Web</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="health master web" />
        <meta name="author" content="damingerdai" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Siderbar>
        {/* <div>
          <main>hh</main>
          <footer>footer</footer>
        </div> */}
      </Siderbar>
    </Box>
  );
};

export default Home;
