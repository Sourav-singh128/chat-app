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
import axios from "axios";
import { useHistory } from "react-router-dom";
import CloudinaryUploadWidget from "../../cloudinaryWiget";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const toast = useToast();

  // const postDetails = (pic) => {
  //   setLoading(true);
  //   if (pic === undefined) {
  //     toast({
  //       title: "please select an image",
  //       status: "warning",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //     return;
  //   }

  //   if (pic.type === "image/jpeg" || pic.type === "image/png") {
  //     console.log("entering here");
  //     console.log("pic ", pic);
  //     const data = new FormData();
  //     data.append("file", pic);
  //     data.append("upload_preset", "chat-app");
  //     data.append("cloud_name", "souravsingh");
  //     fetch("https://api.cloudinary.com/v1_1/souravsingh/image/upload", {
  //       method: "post",
  //       body: data,
  //     })
  //       .then((res) => {
  //         console.log(res.json());
  //         return res.json();
  //       })
  //       .then((data) => {
  //         console.log("data ", data);
  //         setPic(data.url.toString());
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setLoading(false);
  //       });
  //   } else {
  //     toast({
  //       title: "please select an image",
  //       status: "warning",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //     return;
  //   }
  // };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      toast({
        title: "password do not match",
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
        "/api/user",
        { name, email, password, confirmPassword, pic },
        config
      );
      toast({
        title: "Registration complete",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push("/chat");
    } catch (err) {
      toast({
        title: "Registration Failed",
        description: err.response.data.message,
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
        <FormLabel>name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>
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
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="sm">
          <Input
            type={showPass ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightAddon w="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowPass(!showPass)}>
              {showPass ? "Hide" : "Show"}
            </Button>
          </InputRightAddon>
        </InputGroup>
      </FormControl>
      {/* <FormControl>
        <FormLabel>upload your pic</FormLabel>
        <Input
          type="file"
          p="1.5"
          accept="image/*"
          value={pic}
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl> */}

      <CloudinaryUploadWidget setPic={setPic} />
      {console.log("value of pic ", pic)}
      <Button
        colorScheme="teal"
        size="lg"
        style={{ marginTop: 15 }}
        w="100%"
        onClick={submitHandler}
        isLoading={loading}>
        Submit
      </Button>
      <img id="uploadedimage" src=""></img>
    </VStack>
  );
};

export default SignUp;
