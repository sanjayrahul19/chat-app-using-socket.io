import mongoose from "mongoose";
import joi from "joi";

export const userSchema = joi.object({
  name: joi.string().trim().required(),
  username: joi.string().lowercase().trim().required(),
  password: joi.string().min(5).max(12).trim().required(),
  confirmPassword: joi
    .string()
    .valid(joi.ref("password"))
    .required()
    .trim()
    .label("Confirm password")
    .options({ messages: { "any.only": "{{#label}} does not match" } }),
});

export const updateSchema = joi.object({
  name: joi.string().trim(),
  username: joi.string().lowercase().trim(),
  password: joi.string().min(5).max(12).trim(),
  confirmPassword: joi
    .string()
    .valid(joi.ref("password"))
    .trim()
    .label("Confirm password")
    .options({ messages: { "any.only": "{{#label}} does not match" } }),
});

const userSchemas = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    onlineStatus: {
      type: String,
      enum: ["online", Date.now()],
    },
    blocked: {
      type: Array,
      ref: "user",
    },
    contact: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  },
  { versionKey: false }
);

export const User = mongoose.model("user", userSchemas);
