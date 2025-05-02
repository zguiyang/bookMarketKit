import { omit } from 'lodash-es';
import { CreateUserBody, UserResponse } from "@bookmark/schemas";
import { UserModel, IUserDocument, IUserLean } from '@/models/user.model.js';
import { hashPassword } from '@/utils/bcrypt.js';
import { BusinessError } from '@/core/business-error.js';
import { userCodeMessages } from '@/config/code-message.config.js';

export class UserService {
  constructor() {}

  async create(userData: CreateUserBody): Promise<UserResponse> {
    const existingUser = await this.getByUsernameOrEmail({
      username: userData.username,
      email: userData.email,
    });
    if (existingUser) {
      throw new BusinessError(userCodeMessages.existedUser);
    }
    const user = await UserModel.create({
      ...userData,
      password: await hashPassword(userData.password),
    });
    const userJson = user.toJSON<UserResponse>();
    return omit(userJson, 'password');
  }

  async getAll(): Promise<UserResponse[]> {
    return UserModel.find({}, { password: 0 })
      .lean<IUserLean[]>();
  }

  async getByUsernameOrEmail({ 
    username, 
    email 
  }: { 
    username?: string; 
    email?: string; 
  }): Promise<IUserLean | null> {
    return UserModel.findOne({ 
      $or: [{ username }, { email }] 
    }).lean<IUserLean>();
  }

  async getById(id: string): Promise<UserResponse> {
    const user = await UserModel.findById(
      { _id: id }, 
      { password: 0 }
    ).lean<IUserLean>();

    if (!user) {
      throw new BusinessError(userCodeMessages.notFoundUser);
    }
    return user;
  }
}