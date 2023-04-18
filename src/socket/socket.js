import { Server } from "socket.io";
import { addContact } from "./add-contact";
import {
  blocked,
  deliveredMessage,
  message,
  offlineEvents,
  offlineMessage,
  offlineStatus,
  onlineStatus,
  seenMessage,
  unblock,
} from "./emit";
import { Offline } from "../model/offline";

let details = [];
let io = null;
export const socket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    let obj = {
      clientId: socket.id,
      userId: socket.handshake.query.id,
    };

    if (!socket.handshake.query.id) {
      socket.disconnect();
    }

    details.push(obj);

    console.log("user connected with id " + socket.id);

    socket.on("addContact", addContact);
    socket.on("message", message);
    socket.on("blocked", blocked);
    socket.on("unblock", unblock);
    socket.on("deliveredMessage", deliveredMessage);
    socket.on("seenMessage", seenMessage);

    offlineMessage(socket.handshake.query.id);
    offlineEvents(socket.handshake.query.id);
    onlineStatus(socket.handshake.query.id);

    socket.on("disconnect", async () => {
      await offlineStatus(socket.handshake.query.id);
      console.log(details.pop(socket.handshake.query.id), "disconnected");
      console.log(`Client has disconnected : ${socket.id}`);
    });
  });
};

export const emitToSocket = async (id, event, data) => {

  const find = details.filter((item) => {
    return item.userId === id;
  });

  if (find.length === 0) {
    await Offline.create({
      receiver: id,
      event: event,
      data: data,
    });
  }

  console.log("Found client:", details);

  if (find.length > 0) {
    console.log(find.length, "LENGTH====")
    for (let i = 0; i < find.length; i++) {
      io.to(find[i].clientId).emit(event, data);
    }
    console.log("Emitting event:", event, data);
  } else {
    console.log("No matching client found for receiver:", id);
  }
};
