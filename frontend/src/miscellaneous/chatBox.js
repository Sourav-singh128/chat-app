import React, { useState, useEffect } from "react";
import { ChatState } from "../context/chatProvider";
import { useToast, Box, Button, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../components/ChatLoading";
import { getSender } from "../config/ChatLogic";
import GroupChatModal from "./GroupChatModal";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { Pagination, Navigation } from "swiper";
const ChatBox = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setUser, selectedChat, setSelectedChat, chat, setChat } =
    ChatState();
  const toast = useToast();

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchAllChats();
  }, [fetchAgain]);

  const fetchAllChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChat(data);
    } catch (err) {
      toast({
        title: "Error occured",
        description: "failed to load the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      // h="100vh"
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px">
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center">
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden">
        {" "}
        {chat ? (
          <Stack overflowY="scroll">
            {console.log("chat box chat value ", chat)}
            {chat.map((c) => (
              <Box
                onClick={() => setSelectedChat(c)}
                cursor="pointer"
                bg={selectedChat === c ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === c ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={c}>
                <Text>
                  {/* {console.log("chat box isGroupChat", c.isGroupChat)} */}
                  {!c.isGrougChat ? getSender(loggedUser, c.users) : c.chat}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
      {/* <Box id="slider">
        <Swiper
          pagination={{
            type: "progressbar",
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper">
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>
            <img
              src="https://picsum.photos/200/300"
              style={{ width: "100%", height: "300px" }}
            />
          </SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
          <SwiperSlide>Slide 5</SwiperSlide>
          <SwiperSlide>Slide 6</SwiperSlide>
          <SwiperSlide>Slide 7</SwiperSlide>
          <SwiperSlide>Slide 8</SwiperSlide>
          <SwiperSlide>Slide 9</SwiperSlide>
        </Swiper>
      </Box> */}
      <Box display="flex" p="4px" mb="10px">
        <span>
          Disclaimer: &nbsp;
          <span style={{ color: "red" }}>
            This app is created by Us(Anu & Komal), as a part of our
            8th-semester project submission.
          </span>
        </span>
      </Box>
    </Box>
  );
};

export default ChatBox;
