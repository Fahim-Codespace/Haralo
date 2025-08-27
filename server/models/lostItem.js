import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    item: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    photo: { type: String }
});

const LostItem = mongoose.model('LostItem', lostItemSchema, 'lostitems');

export default LostItem;
