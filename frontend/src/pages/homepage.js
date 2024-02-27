import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tab,
  Tabs,
  TabPanels,
  TabPanel,
  TabList,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const Homepage = () => {
  const history = useHistory();
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userInfo"));
    if (!userDetails) {
      history.push("/");
    }
  }, [history]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p="3"
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px">
        <Text
          textAlign="center"
          fontSize="2xl"
          fontFamily="Work sans"
          color="black">
          lets chat
        </Text>
      </Box>
      <Box bg="white" w="100%" p="4" borderRadius="lg" borderWidth="1px">
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
