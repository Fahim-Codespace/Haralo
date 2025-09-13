import mongoose from 'mongoose';

const foundItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  item: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String },
  contact: { type: String },
  photo: { type: String }
});

// Safe model registration: replace any previously-registered FoundItem model that lacks the `contact` path
const foundModelName = 'FoundItem';
if (mongoose.models && mongoose.models[foundModelName]) {
  const existing = mongoose.models[foundModelName];
  try {
    const hasContact = !!(existing.schema && existing.schema.path && existing.schema.path('contact'));
    if (!hasContact) {
      delete mongoose.models[foundModelName];
      if (mongoose.connection && mongoose.connection.models && mongoose.connection.models[foundModelName]) {
        delete mongoose.connection.models[foundModelName];
      }
    }
  } catch (e) {
    // ignore and continue
  }
}

const FoundItem = mongoose.models[foundModelName] || mongoose.model(foundModelName, foundItemSchema);

export default FoundItem;