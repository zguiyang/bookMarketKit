import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { AuthRegisterDTO, AuthLoginDTO } from './dto/request.dto';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user', async () => {
    const registerData: AuthRegisterDTO = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      emailCode: '123456',
    };

    const result = await service.register(registerData);
    expect(result).toBeDefined();
  });

  it('should login a user', async () => {
    const loginData: AuthLoginDTO = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await service.login(loginData);
    expect(result).toBeDefined();
  });

  it('should logout a user', async () => {
    const result = await service.logout({
      email: 'test@example.com',
      userId: '1',
      username: 'testusername',
    });
    expect(result).toBeDefined();
  });

  it('should generate email verification code', async () => {
    await service.getEmailVerificationCode('test@example.com');
    // Check Redis or other side effects if needed
  });

  it('should verify email code', async () => {
    const result = await service.verifyEmailCode('test@example.com', '123456');
    expect(result).toBe(true);
  });
});
