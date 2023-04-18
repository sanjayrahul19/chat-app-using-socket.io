import { User } from "../../model/user";
import { responseHandler } from "../../response/responseHandler";

export const getAllUser = async (req, res) => {
  try {
    const user = await User.find({}).select("name username");
    return responseHandler(res, 200, "Data sent successfully", true, user);
  } catch (err) {
    return responseHandler(res, 500, err.message,false);
  }
};
