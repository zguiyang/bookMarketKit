import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/modules/users/users.service';
import { jwtConstants } from '@/settings/constant.setting';
import { RequestUser } from '@/dto/request.dto';
import { JwtSignTokenPayload } from './jwt.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(jwtConstants.JWT_ACCESS_SECRET),
    });
  }

  async validate(payload: JwtSignTokenPayload): Promise<RequestUser> {
    const { email } = payload;

    const user = await this.usersService.findUserByFields('email', email);

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return {
      userId: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
