const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log("user id ", userId);
  if (!userId) {
    console.log("userId param was not sent with request");
    res.sendStatus(400);
  }
  console.log("isChat value outside ");
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user_id } } },
      { users: { $elemMatch: { userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  console.log("isChat value inside", isChat);
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  console.log("isChat value ", isChat.length);
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const creatdChat = await Chat.create(chatData);
      console.log("createdChat ", creatdChat);
      const fullChat = await Chat.findOne({ _id: creatdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (err) {
      res.send(400);
      throw new Error(err.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        res.status(200).send(result);
      });
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send("please fill all the fields");
  }
  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    res.status(400).send("more than 2 users is required to form a group");
  }

  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chat: req.body.name,
      isGrougChat: true,
      groupAdmin: req.user,
      users: users,
    });

    const fullChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullChat);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatName, chatId } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chat: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(400);
    throw new Error("chat not found");
  } else {
    res.status(200).json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  const addUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addUser) {
    res.status(400);
    throw new Error("user does not exist");
  } else {
    res.status(200).json(addUser);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  const removeUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removeUser) {
    res.status(400);
    throw new Error("user does not exist");
  } else {
    res.status(200).json(removeUser);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
