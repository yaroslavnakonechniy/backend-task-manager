import { Schema, Types, model } from 'mongoose';
import { IBoard } from '../interfaces';

const boardSchema = new Schema<IBoard>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const Board = model('Board', boardSchema);
