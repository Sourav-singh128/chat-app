import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import {
  Box,
  Text,
  IconButton,
  Spinner,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import UserModal from "../miscellaneous/UserModal";
// import "font-awesome/css/font-awesome.min.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHeart } from "@fortawesome/free-solid-svg-icons";
import HeartIcon from "./hearIcon";
import { getSender } from "../config/ChatLogic";
import axios from "axios";
import UpdateGroupChatModel from "../miscellaneous/UpdateGroupChatModel";
import "./style.css";
import ScrolableChat from "./ScrolableChat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3080";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [socketConn, setSocketConn] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connnection", () => {
      setSocketConn(true);
    });
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("new message recieved", newMessageRecieved);
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // notification
      } else {
        console.log(
          "comming in else ",
          messages,
          "new msgRcvd ",
          newMessageRecieved
        );
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);

      //    socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        console.log("message ", data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (event) => {
    setNewMessage(event.target.value);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center">
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGrougChat ? (
              <>
                {getSender(user, selectedChat.users)}
                {/* <FontAwesomeIcon
                  icon="fa-sharp fa-solid fa-heart"
                  beat
                  style={{ color: "#eb1414" }}
                /> */}
                {/* <div>
                  <i className="fa-sharp fa-solid fa-heart"></i>
                </div> */}
                <Box display="flex" alignItems="center">
                  <Text fontSize="lg">Made with</Text>
                  <HeartIcon />
                  <Text fontSize="lg">by Anu & Komal</Text>
                </Box>
                {/* <FontAwesomeIcon icon={faHeart} /> */}

                <UserModal />
              </>
            ) : (
              <>
                {selectedChat.chat.toUpperCase()}
                <Box display="flex" alignItems="center">
                  <Text fontSize="lg">Made with</Text>
                  <HeartIcon />
                  <Text fontSize="lg">by Anu & Komal</Text>
                </Box>
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden">
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrolableChat messages={messages} />
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
