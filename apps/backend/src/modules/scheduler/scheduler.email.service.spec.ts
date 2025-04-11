import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerEmailService } from './scheduler.email.service';

describe('SchedulerEmailService', () => {
  let service: SchedulerEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulerEmailService],
    }).compile();

    service = module.get<SchedulerEmailService>(SchedulerEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
