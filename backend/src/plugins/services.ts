import fp from 'fastify-plugin';
import { QueueService } from '@/services/queue/queue.service';

export interface ServiceMap {
  queueService: QueueService;
}

export default fp(async (fastify) => {
  const queueService = new QueueService(fastify);

  const services: ServiceMap = {
    queueService: queueService,
  };

  fastify.decorate('services', services);
});
