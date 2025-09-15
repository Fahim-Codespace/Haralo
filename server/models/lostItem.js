import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    item: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
        contact: { type: String, required: true },
    photo: { type: String },
    // who posted this lost item
    posterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    // status: lost | got returned
    status: { type: String, enum: ['lost', 'got returned'], default: 'lost' }
   
});

// If a model with the same name was registered earlier (possibly with a stale schema),
// inspect it and replace it if it doesn't contain the `contact` path.
const modelName = 'LostItem';
if (mongoose.models && mongoose.models[modelName]) {
    const existing = mongoose.models[modelName];
    try {
        const hasContact = !!(existing.schema && existing.schema.path && existing.schema.path('contact'));
        if (!hasContact) {
            // remove the existing model so we can re-register it with the correct schema
            delete mongoose.models[modelName];
            if (mongoose.connection && mongoose.connection.models && mongoose.connection.models[modelName]) {
                delete mongoose.connection.models[modelName];
            }
        }
    } catch (e) {
        // ignore and continue to define model below
    }
}

const LostItem = mongoose.models[modelName] || mongoose.model(modelName, lostItemSchema, 'lostitems');

export default LostItem;
