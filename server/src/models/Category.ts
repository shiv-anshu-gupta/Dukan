import mongoose, { HydratedDocument } from 'mongoose';

export type Category = {
    name : string;
    createdAt? : string;
    updatedAt? : string;
}

export type CategoryDocument = HydratedDocument<Category>;
const CategorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true, 
    }
}, {timestamps : true});

export const Category = mongoose.model<CategoryDocument>('Category', CategorySchema);