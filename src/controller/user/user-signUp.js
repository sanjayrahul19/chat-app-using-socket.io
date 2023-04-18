import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userSchema, User } from "../../model/user";
import { responseHandler } from "../../response/responseHandler";

export const userSignUp = async (req, res) => {
  try {
    let otp = Math.floor(1000 + Math.random() * 9000);
    // console.log(otp);
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return responseHandler(res, 403, error.details[0].message, false);
    } else {
      const hash = await bcrypt.hash(value.password, 10);
      value.password = hash;
      const preUser = await User.findOne({ username: value.username });
      if (preUser) {
        return responseHandler(res, 400, "User already exists", false);
      } else {
        const user = new User({
          name: value.name,
          username: value.username,
          password: value.password,
          confirmPassword: value.confirmPassword,
        });
        let users = await user.save();
        // users.password = users.role = user.confirmPassword = users.otp = 0;
        const token = jwt.sign({ id: user._id }, "sanjay", {
          expiresIn: "1d",
        });
        return responseHandler(
          res,
          200,
          "Account created successfully",
          true,
          {
            _id: users._id,
            name: users.name,
            username: users.username,
            token: token,
          }
        );
      }
    }
  } catch (err) {
    return responseHandler(res, 500, err.message, false);
  }
};
