import { Schema, Types, model } from 'mongoose';
import { ITask } from '../interfaces';

const taskSchema = new Schema<ITask>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  workflow: {
    type: String,
    required: true,
  },
  boardId: {
    type: String,
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
}, {  timestamps: true });

export const Task = model('Task', taskSchema);
