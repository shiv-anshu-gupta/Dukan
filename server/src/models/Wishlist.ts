import mongoose, {HydratedDocument, Types} from "mongoose";


export type Wishlist = {
    user : Types.ObjectId;
    products : Types.ObjectId[];
    createdAt : Date;
    updatedAt : Date;
}

export type WishlistDocument = HydratedDocument<Wishlist>;

const wishlistSchema = new mongoose.Schema<Wishlist>({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        unique : true,
    },
    products : {
        type : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product',
        }],
        default : [],
    }
}, {timestamps : true});

export const Wishlist = mongoose.models.Wishlist || mongoose.model<Wishlist>('Wishlist', wishlistSchema as mongoose.Schema<Wishlist>);