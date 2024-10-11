import mongoose from 'mongoose';
import { FAMILIES } from '../utils/constants.js';

const TrainSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  trainLine: { type: String, required: true, enum: FAMILIES },
  activeAt: { type: Date, required: true },
  colors: { type: [String], required: true },
  vagons: { type: Number, required: true },
  lengthPerVagon: { type: Number, required: true },
});

const TrainModel = mongoose.model('Train', TrainSchema);

TrainModel.createCollection().then(() => {
  console.log('Train collection created');
});

export default TrainModel;
export { TrainModel };
