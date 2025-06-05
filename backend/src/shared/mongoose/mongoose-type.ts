import { Document, Types } from 'mongoose';

/**
 * Base interface for Mongoose documents.
 */
export interface IBaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Base type for Lean documents.
 */
export interface IBaseLeanDocument {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Utility type for creating Mongoose document types.
 * @template T - Response type (e.g., BookmarkResponse)
 * @template K - Fields to be replaced with ObjectId
 * @template O - Field types to be overridden
 */
export type CreateDocument<T, K extends keyof T = never, O extends object = object> = IBaseDocument &
  Omit<T, '_id' | 'createdAt' | 'updatedAt' | K | keyof O> & {
    [P in K]: P extends `${string}s` ? Types.ObjectId[] : Types.ObjectId;
  } & O;

/**
 * Utility type for creating Lean document types.
 * @template T - Response type (e.g., BookmarkResponse)
 * @template O - Field types to be overridden
 */
export type CreateLeanDocument<T, O extends object = object> = IBaseLeanDocument &
  Omit<T, '_id' | 'createdAt' | 'updatedAt' | keyof O> &
  O;
