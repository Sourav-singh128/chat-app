import React, { useState } from "react";
import {
  Tooltip,
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider";
import UserModal from "./UserModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ChatDrawer from "./ChatDrawer";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import ChatLoading from "../components/ChatLoading";
import UserListItem from "../components/userAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setUser, selectedChat, setSelectedChat, chat, setChat } =
    ChatState();
  const history = useHistory();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // console.log("checking use context ", user);
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "content-type": "Application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      toast({
        title: "Error fetching the chat",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSearch = async () => {
    console.log("search ", search);
    if (!search) {
      toast({
        title: "please enter user in the search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      //did n't get the logic for this video 11 at time. 47 min.
      // if (!chat.find((c) => c._id === data._id)) {
      //   setChat([data, ...chat]);
      // }
      setLoading(false);
      setSearchResult(data);
      console.log("search result ", searchResult);
    } catch (err) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  console.log("user ", user);
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
        <Box>
          <Search2Icon />
          <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
              <Text d={{ base: "none", md: "flex" }} px="2" ml="2px">
                Search User
              </Text>
            </Button>
          </Tooltip>
        </Box>
        <Text fontFamily="Work-sans" fontSize="2xl">
          Let's Chat
        </Text>
        <Box display="flex">
          {/* <Menu>
            <MenuButton>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>

            <MenuList>
              <MenuItem>Download</MenuItem>
              <MenuItem>Create a Copy</MenuItem>
              <MenuItem>Mark as Draft</MenuItem>
              <MenuItem>Delete</MenuItem>
              <MenuItem>Attend a Workshop</MenuItem>
            </MenuList>
          </Menu> */}
          <UserModal user={user}></UserModal>
          {/* <UserModal><MenuItem>My Profile</MenuItem></UserModal> */}

          <Text
            as="b"
            color="orange"
            cursor="pointer"
            px={2}
            onClick={logoutHandler}>
            Logout
          </Text>
          <Avatar size="sm" name={user.name} src={user.pic} />

          {/* <Box onClick={logoutHandler}>fsfljsl</Box> */}
        </Box>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>
          <DrawerBody>
            <Box display="flex" mb={2}>
              <Input
                placeholder="search by email or name"
                mr={1}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {/* {loading ? <ChatLoading /> : null} */}
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
