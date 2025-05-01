import mongoose, { Schema } from 'mongoose';
import leanTransformPlugin from '@/shared/mongoose/leanTransformPlugin.js';
import { commonTransform } from '@/shared/mongoose/common-transform.js';
import { IBaseDocument } from '@/shared/mongoose/mongoose-type.js';

export interface IUser extends IBaseDocument {
  nickname?: string;
  username: string;
  email: string;
  password?: string;
}

const UserSchema = new Schema<IUser>(
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

export const UserModel = mongoose.model<IUser>('User', UserSchema);
