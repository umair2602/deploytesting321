import { model, Schema, models } from "mongoose";
import IUser from "./interfaces/user";

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  appid: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: false,
  },
  lastname: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  address1: {
    type: String,
    required: false,
  },
  address2: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  zipcode: {
    type: String,
    required: false,
  },
  profilePic: {
    type: String,
    required: false,
  },
  useragreementagreed: {
    type: Boolean,
    require: false,
  },
  registerDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  bio: { type: String, required: false },
  following: [
    {
      appId: { type: String },
      profilePic: { type: String },
    },
  ],
  pollHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Poll",
    },
  ],
  favorites: [
    {
      favoriteType: { type: String, enum: ["Poll", "Answer"] },
      favoriteId: {
        type: Schema.Types.ObjectId,
        refPath: "favoriteType",
      },
    },
  ],
  timeOnSite: {
    hour: { type: Number },
    minutes: { type: Number },
    seconds: { type: Number },
  },
  timeSpentOnPoll: [
    {
      poll: {
        type: Schema.Types.ObjectId,
        ref: "Poll",
      },
      hours: { type: Number },
      minutes: { type: Number },
      seconds: { type: Number },
      pollCount: { type: Number },
    },
  ],
});

export default models.User || model<IUser>("User", userSchema);
// module.exports = mongoose.models.User || mongoose.model("User", userSchema);
