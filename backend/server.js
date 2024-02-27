const express = require("express");
const chats = require("./data/data");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const app = express();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { NotFound, ErrorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
app.use(express.json());
connectDb();

app.get("/", (req, res) => {
  res.send("hello there");
});

app.get("/chat", (req, res) => {
  res.send(chats);
});

app.get("/chat/:id", (req, res) => {
  //   console.log(req.params.id);
  const singleChat = chats.find((c) => {
    // console.log(c._id);
    return c._id === req.params.id;
  });
  console.log("single chat value ", singleChat);
  res.send(singleChat);
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(NotFound);
app.use(ErrorHandler);

const port = process.env.PORT || 3080;
const server = app.listen(port, console.log("server is running on port 3080"));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(`socket is connected.`);

  socket.on("setup", (userData) => {
    console.log("user id ", userData._id);
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    console.log("room ", room);
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    // console.log("newMessageR", newMessageRecieved);
    if (!chat.users) return console.log("chat users are not defined");
    console.log("users", newMessageRecieved.chat.users);
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});
