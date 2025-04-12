import { Test, TestingModule } from '@nestjs/testing';
import { TasksEmailService } from './tasks.email.service';

describe('TasksEmailService', () => {
  let service: TasksEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksEmailService],
    }).compile();

    service = module.get<TasksEmailService>(TasksEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
