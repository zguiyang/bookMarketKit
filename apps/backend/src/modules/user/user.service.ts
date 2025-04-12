import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@/core/database/database.service';
import { ResponseService } from '@/core/response/response.service';

import { usersCodeMessages } from '@/settings/code-message.setting';

import { usersTable } from '@/db/schemas';
import { hashPassword } from '@/shared/bcrypt';

import { CreateUserDTO } from './dto/request.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly responseService: ResponseService,
  ) {}

  async findAll() {
    return this.databaseService.db.query.usersTable.findMany({});
  }

  async findOne(id: string) {
    const user = await this.databaseService.db.query.usersTable.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });

    if (!user) {
      return this.responseService.error(usersCodeMessages.notFoundUser);
    }
    return this.responseService.success({ data: user });
  }

  async findUserByFields(
    key: keyof Pick<typeof usersTable, 'email' | 'username'>,
    value: string,
  ) {
    return this.databaseService.db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users[key], value),
    });
  }

  async create(data: CreateUserDTO) {
    const existingUser =
      await this.databaseService.db.query.usersTable.findFirst({
        where: (users, { eq, or }) =>
          or(eq(users.username, data.username), eq(users.email, data.email)),
      });
    if (existingUser) {
      return this.responseService.error(usersCodeMessages.existedUser);
    }

    const userHashPassword = await hashPassword(data.password);
    const newUser = await this.databaseService.db.insert(usersTable).values({
      username: data.username,
      email: data.email,
      password: userHashPassword,
    });

    if (newUser.rowCount > 0) {
      return this.responseService.success<null>({});
    }
    return this.responseService.error(usersCodeMessages.createError);
  }

  update(id: string) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
