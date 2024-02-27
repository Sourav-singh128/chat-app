import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/chatProvider";
import SideDrawer from "../miscellaneous/SideDrawer";
import MyChats from "../miscellaneous/MyChats";
import ChatBox from "../miscellaneous/chatBox";
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

const Chatpage = () => {
  const { user, setUser, setSelectedChat, chat, setChat } = ChatState();
  const [fetchAgain, setFetchAgain] = useState();
  console.log("comming to chat page");
  console.log("----------------");
  console.log("user in chatpage ", user);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer></SideDrawer>}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px">
        {user && <ChatBox fetchAgain={fetchAgain}></ChatBox>}
        {user && (
          <MyChats
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}></MyChats>
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
