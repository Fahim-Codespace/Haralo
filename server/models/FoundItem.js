import mongoose from 'mongoose';

const foundItemSchema = new mongoose.Schema({
  name: String,
  item: String,
  location: String,
  date: String,
  description: String,
  photo: String 
});

export default mongoose.model('FoundItem', foundItemSchema);