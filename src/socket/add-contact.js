import { User } from "../model/user";
import { emitToSocket } from "./socket";

export const addContact = async (data) => {
  try {
    // console.log(data);
    const sender = await User.findById(data.sender);
    const id = sender.contact;
    if (!id.includes(data.receiver)) {
      const user = await User.findByIdAndUpdate(
        { _id: data.sender },
        { $push: { contact: data.receiver } },
        { new: true }
      );
    }
    emitToSocket(data.sender, "addContact", data);

    const receiver = await User.findById(data.receiver);
    const receiverId = receiver.contact;

    if (!receiverId.includes(data.sender)) {
      const user = await User.findByIdAndUpdate(
        { _id: data.receiver },
        { $push: { contact: data.sender } },
        { new: true }
      );
    }

    emitToSocket(data.receiver, "addContact", data);
  } catch (error) {
    console.log(error);
  }
};
