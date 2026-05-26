import mongoose, { HydratedDocument, Schema, Types } from "mongoose";
import { ProductSize } from "./Products";


export type CartItem = {
    product : Types.ObjectId;
    quantity : number;
    size : ProductSize;
    color : string;
};

export type Cart = {
    user: Types.ObjectId;
    items: CartItem[];
    createdAt: Date;
    updatedAt: Date;
}

export type CartDocument = HydratedDocument<Cart>;

const cartItemSchema = new mongoose.Schema({
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        required : true,
    },
    quantity : {
        type : Number,
        required : true,
        min : 1,
    },
    color : {
        type : String,
        trim : true,
    },
    size : {
        type : String,
        enum : ["S", "M", "L", "XL"],
    }
},{
    _id : false
})

const CartSchema = new Schema<Cart>({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        unique : true,
    },
    items : {
        type : [cartItemSchema],
        default : [],
    }
}, {timestamps : true});

export const Cart = mongoose.models.Cart || mongoose.model<Cart>('Cart', CartSchema);