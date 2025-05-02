import mongoose, { Schema } from 'mongoose';
import leanTransformPlugin from '@/shared/mongoose/leanTransformPlugin.js';
import { commonTransform } from '@/shared/mongoose/common-transform.js';
import { UserResponse } from '@bookmark/schemas';
import { CreateDocument, CreateLeanDocument } from '@/shared/mongoose/mongoose-type.js';

// Mongoose 文档类型
export type IUserDocument = CreateDocument<
  UserResponse & { password: string }
>;

// Lean 查询结果类型
export type IUserLean = CreateLeanDocument<UserResponse>;

const UserSchema = new Schema<IUserDocument>(
  {
    nickname: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { 
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: commonTransform
    }
   }
);

UserSchema.plugin(leanTransformPlugin);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
