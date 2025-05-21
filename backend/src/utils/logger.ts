import pino from 'pino';
import pretty from 'pino-pretty';
import env from '@/lib/env';

const Logger =
  env.NODE_ENV === 'development'
    ? pino(
        pretty({
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
        })
      )
    : console;

export default Logger;
