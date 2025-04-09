import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtSignTokenPayload } from './jwt.dto';

@Injectable()
export class JwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: NestJwtService,
  ) {}

  generateToken(payload: Record<string, any>): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  // 生成访问Token
  generateAccessToken(payload: JwtSignTokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '7d',
    });
  }

  // 生成刷新Token
  generateRefreshToken(payload: JwtSignTokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }

  // 验证访问Token
  verifyAccessToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  // 验证刷新jkToken
  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  decodeToken(token: string): any {
    const decoded = this.jwtService.decode(token);
    return decoded;
  }
}
