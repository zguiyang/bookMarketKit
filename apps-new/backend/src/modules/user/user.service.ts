import { omit } from 'lodash-es';
import { CreateUserBody }from "@bookmark/schemas";
import { UserModel, IUser } from '@/models/user.model.js';
import { hashPassword } from '@/utils/bcrypt.js';
import { BusinessError } from '@/core/business-error.js';
import { userCodeMessages } from '@/config/code-message.config.js';
export class UserService {
  constructor() {}

  async create(userData: CreateUserBody): Promise<Omit<IUser, 'password'>> {
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
    return omit(user.toJSON(), 'password');
  }

  async getAll(): Promise<Omit<IUser, 'password'>[]> {
    return UserModel.find({}, { password: 0 }).lean();
  }

  async getByUsernameOrEmail({ username, email }: { username?: string, email?: string }): Promise<IUser | null> {
    return UserModel.findOne({ $or: [{ username }, { email }] }).lean();
  }

  async getById(id: string): Promise<Omit<IUser, 'password'>> {
    const user = await UserModel.findById({ _id: id }, { password: 0 }).lean();
    if (!user) {
      throw new BusinessError(userCodeMessages.notFoundUser);
    }
    return user;
  }
}