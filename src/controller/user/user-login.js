import { User } from "../../model/user";
import bcrypt from "bcrypt";
import { responseHandler } from "../../response/responseHandler";
import jwt from "jsonwebtoken";

export const userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const password = await bcrypt.compare(req.body.password, user.password);
      if (password) {
        const token = await jwt.sign({ id: user._id }, "sanjay");
        return responseHandler(res, 200, "LoggedIn Successfully", true, {
          _id: user._id,
          name: user.name,
          username: user.username,
          token: token,
        });
      } else {
        return responseHandler(res, 401, "Incorrect password", false);
      }
    } else {
      return responseHandler(res, 404, "User not found", false);
    }
  } catch (err) {
    return responseHandler(res, 500, err.message, false);
  }
};
