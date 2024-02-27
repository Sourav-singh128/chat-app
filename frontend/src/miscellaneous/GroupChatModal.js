import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider";
import axios from "axios";
import UserListItem from "../components/userAvatar/UserListItem";
import UserBadgeItem from "../components/userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chat, setChat } = ChatState();

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    setSearch(query);

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log("group chat modal ", data);
      setLoading(false);
      setSearchResult(data);
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
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUser) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );
      setChat([data, ...chat]);
      onClose();
      console.log("group chat moda chats value", chat);
      toast({
        title: "New Group Chat Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      toast({
        title: "Failed to create the chat",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleDelete = (deleteUser) => {
    console.log("comming to handle delete");
    console.log("selected user", selectedUser, "delete User ", deleteUser);
    const rmUser = selectedUser.filter((us) => us !== deleteUser);
    setSelectedUser(rmUser);
  };

  const handleGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toast({
        title: "User Already Exist",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUser([...selectedUser, userToAdd]);
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users eg: Annu Sourav"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUser.map((u) => {
                console.log("group chat model ", u);
                return (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}></UserBadgeItem>
                );
              })}
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
