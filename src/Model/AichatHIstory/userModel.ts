import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    userId: string;
    credit: number;
}

const UserSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    credit: { type: Number, default: 10 }, 
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;