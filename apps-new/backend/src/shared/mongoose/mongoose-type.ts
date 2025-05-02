import { Document, Types } from 'mongoose';

/**
 * Mongoose 文档基础接口
 */
export interface IBaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 基础 Lean 文档类型
 */
export interface IBaseLeanDocument {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建 Mongoose 文档类型的工具类型
 * @template T - 响应类型（如 BookmarkResponse）
 * @template K - 需要替换为 ObjectId 的字段
 * @template O - 需要重写的字段类型
 */
export type CreateDocument<
  T,
  K extends keyof T = never,
  O = {}
> = IBaseDocument & 
  Omit<T, '_id' | 'createdAt' | 'updatedAt' | K | keyof O> & 
  {
    [P in K]: P extends `${string}s` ? Types.ObjectId[] : Types.ObjectId;
  } &
  O;

/**
 * 创建 Lean 文档类型的工具类型
 * @template T - 响应类型（如 BookmarkResponse）
 * @template O - 需要重写的字段类型
 */
export type CreateLeanDocument<
  T,
  O = {}
> = IBaseLeanDocument & 
  Omit<T, '_id' | 'createdAt' | 'updatedAt' | keyof O> & 
  O;
