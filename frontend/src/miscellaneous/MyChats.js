import React from "react";
import { ChatState } from "../context/chatProvider";
import { useToast, Box, Button, Stack, Text } from "@chakra-ui/react";
import SingleChat from "../components/SingleChat";

const MyChats = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px >Single">
      {" "}
      <SingleChat
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}></SingleChat>
    </Box>
  );
};

export default MyChats;
