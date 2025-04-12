import { Test, TestingModule } from '@nestjs/testing';
import { TaskEmailService } from './task.email.service';

describe('TasksEmailService', () => {
  let service: TaskEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskEmailService],
    }).compile();

    service = module.get<TaskEmailService>(TaskEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
