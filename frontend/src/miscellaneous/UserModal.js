import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Image,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
// import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/chatProvider";
const UserModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setUser, setSelectedChat, chat, setChat } = ChatState();
  console.log("username ", user);
  return (
    <>
      {/* {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        
      )} */}
      {/* <IconButton icon={<ViewIcon />} onClick={onOpen} /> */}
      <Text
        as="b"
        color="orange"
        px={2}
        onClick={onOpen}
        style={{ cursor: "pointer" }}>
        Profile
      </Text>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontFamily="Work sans"
            fontSize="40px">
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between">
            <Image
              src={user.pic}
              alt="user.name"
              borderRadius="full"
              boxSize="150px"
            />
            <Text fontSize={{ base: "26px", md: "30px" }}>
              Email : {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserModal;
