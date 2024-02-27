import { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
const chatContext = createContext();

export const ChatProvide = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chat, setChat] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userDetails);
    if (userDetails) {
      console.log("history", history);
      console.log("type", typeof history);
      //   history.push("/");
    }
  }, [history]);
  return (
    <chatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chat, setChat }}>
      {children}
    </chatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(chatContext);
};

// export default ChatProvide;
