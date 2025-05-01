import { Document } from 'mongoose';

export interface IBaseDocument extends Document {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}