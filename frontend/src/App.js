import "./App.css";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Route } from "react-router-dom";
import chatpage from "./pages/chatpage";
import homepage from "./pages/homepage";

function App() {
  return (
    <div className="App">
      {/* <div>hello there</div>
        <Button colorScheme="blue">Button</Button> */}
      <Route path="/" component={homepage} exact />
      <Route path="/chat" component={chatpage} />
    </div>
  );
}

export default App;
