import type { SelectUser } from '@/db/schemas';
import { Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER, type DbType } from '@/core/database/database-provider';
import { BusinessException } from '@/common/exceptions/business.exception';

import { usersCodeMessages } from '@/settings/code-message.setting';

import { usersTable } from '@/db/schemas';
import { hashPassword } from '@/shared/bcrypt';

import { CreateUserDTO } from './dto/request.dto';

// 定义不包含密码的用户类型
type UserWithoutPassword = Omit<SelectUser, 'password'>;

@Injectable()
export class UserService {
  constructor(@Inject(DB_PROVIDER) private readonly database: DbType) {}

  async create(data: CreateUserDTO) {
    const existingUser = await this.database.query.usersTable.findFirst({
      where: (users, { eq, or }) =>
        or(eq(users.username, data.username), eq(users.email, data.email)),
    });
    if (existingUser) {
      throw new BusinessException(usersCodeMessages.existedUser);
    }

    const userHashPassword = await hashPassword(data.password);
    const newUser = await this.database.insert(usersTable).values({
      username: data.username,
      email: data.email,
      password: userHashPassword,
    });

    if (newUser.rowCount < 1) {
      throw new BusinessException(usersCodeMessages.createError);
    }
  }

  update(id: string) {
    return `This action updates a #${id} user`;
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    return this.database.query.usersTable.findMany({
      columns: {
        id: true,
        nickname: true,
        username: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findOne(id: string): Promise<SelectUser> {
    const user = await this.database.query.usersTable.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });

    if (!user) {
      console.error(`User with id ${id} not found`);
      throw new BusinessException(usersCodeMessages.notFoundUser);
    }
    return user;
  }

  async findUserByFields(
    key: keyof Pick<typeof usersTable, 'email' | 'username'>,
    value: string,
  ) {
    return this.database.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users[key], value),
    });
  }
}
