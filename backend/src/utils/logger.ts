import pino from 'pino';
import pretty from 'pino-pretty';

const Logger = pino(
  pretty({
    colorize: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname',
  })
);

export default Logger;
