import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  VStack,
  Input,
  InputGroup,
  Button,
  InputRightAddon,
  useToast,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const toast = useToast();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "please enter all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "Login complete",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      console.log("data ", data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push("/chat");
    } catch (err) {
      console.log("error ", err);
      toast({
        title: "Login failed",
        // description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>email</FormLabel>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>password</FormLabel>
        <InputGroup size="sm">
          <Input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightAddon w="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightAddon>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="teal"
        style={{ marginTop: 15 }}
        w="100%"
        onClick={submitHandler}
        isLoading={loading}>
        Login
      </Button>
      <Button
        colorScheme="red"
        variant="solid"
        style={{ marginTop: 15 }}
        w="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}>
        Guest User Login
      </Button>
    </VStack>
  );
};

export default Login;
