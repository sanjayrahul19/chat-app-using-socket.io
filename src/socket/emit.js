import { emitToSocket } from "./socket";
import { Chat } from "../model/chat";
import { User } from "../model/user";
import { Offline } from "../model/offline";
import moment from "moment";

export const message = async (data) => {
  const sender = await User.findById(data.sender);
  const blocked = sender.blocked;
  const receiver = await User.findById(data.receiver);
  const recBlocked = receiver.blocked;
  if (blocked.includes(data.receiver) || recBlocked.includes(data.sender)) {
    const chat = await Chat.create({
      sender: data.sender,
      receiver: data.receiver,
      message: data.message,
      message_type: data.message_type,
    });
    emitToSocket(data.sender, "message", data.message);
  } else {
    const chat = await Chat.create({
      sender: data.sender,
      receiver: data.receiver,
      message: data.message,
      message_type: data.message_type,
    });
    emitToSocket(data.sender, "message", data.message);
    emitToSocket(data.receiver, "message", data.message);
  }
};

export const offlineMessage = async (id) => {
  const chat = await Chat.find({ receiver: id, status: 1 });
  emitToSocket(id, "offlineMessage", chat);
};

export const deliveredMessage = async (data) => {
  const chat = await Chat.updateMany(
    { _id: { $in: data.id } },
    { $set: { status: 2 } }
  );
  emitToSocket(data.receiver, "deliveredMessage", data);
  emitToSocket(data.sender, "deliveredMessage", data);
};

export const seenMessage = async (data) => {
  const chat = await Chat.updateMany(
    { _id: { $in: data.id } },
    { $set: { status: 3 } }
  );
  emitToSocket(data.receiver, "seenMessage", data);
  emitToSocket(data.sender, "seenMessage", data);
};

export const offlineEvents = async (id) => {
  const chat = await Offline.find({ receiver: id });
  for (let i = 0; i < chat.length; i++) {
    emitToSocket(id, chat[i].event, chat[i].data);
  }
  const chats = await Offline.deleteMany({ receiver: id });
};

export const onlineStatus = async (id) => {
  const user = await User.findById({ _id: id });
  const contact = user.contact;
  for (let i = 0; i < contact.length; i++) {
    await emitToSocket(contact[i].toString(), "onlineStatus", {
      user: user._id,
      status: "Online",
    });
  }
  await User.findByIdAndUpdate(
    { _id: id },
    { onlineStatus: "online" },
    { new: true }
  );
};

export const offlineStatus = async (id) => {
  const user = await User.findById({ _id: id });
  const contact = user.contact;
  for (let i = 0; i < contact.length; i++) {
    await emitToSocket(contact[i].toString(), "offlineStatus", {
      user: user._id,
      status: moment().format(),
    });
  }

  await User.findByIdAndUpdate(
    { _id: id },
    { onlineStatus: moment().format() },
    { new: true }
  );
};

export const blocked = async (data) => {
  const sender = await User.findById(data.sender);
  const blocked = sender.blocked;
  if (!blocked.includes(data.receiver)) {
    const user = await User.findByIdAndUpdate(
      { _id: data.sender },
      { $push: { blocked: data.receiver } },
      { new: true }
    );
  }
  emitToSocket(data.sender, "blocked", data);
};

export const unblock = async (data) => {
  const sender = await User.findById(data.sender);
  const blocked = sender.blocked;
  if (blocked.includes(data.receiver)) {
    const user = await User.findByIdAndUpdate(
      { _id: data.sender },
      { $pull: { blocked: data.receiver } },
      { new: true }
    );
  }
  emitToSocket(data.sender, "unblock", "User unblocked successfully");
};
