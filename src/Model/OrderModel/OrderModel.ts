import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  userId: string;
  razorpayOrderId: string;
  paymentId?: string;
  amount: number;

  status: "created" | "paid" | "failed"| "pending";
  credits:number;

}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    razorpayOrderId: { type: String, required: true },
    paymentId: { type: String },
    amount: { type: Number, required: true },
   
    credits:{type:Number,required:true},
    
    status: {
      type: String,
      enum: ["created", "paid", "failed","pending"],
      default: "created",
    },
  },

  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
