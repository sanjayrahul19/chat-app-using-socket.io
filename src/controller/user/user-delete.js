import { User } from "../../model/user";
import { responseHandler } from "../../response/responseHandler";

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete({ _id: id });
    return responseHandler(res, 200, "User Details deleted Successfully", true);
  } catch (err) {
    return responseHandler(res, 500, err.message, false);
  }
};
