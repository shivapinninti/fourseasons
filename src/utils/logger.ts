type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function stamp(): string {
  return new Date().toISOString();
}

function write(level: LogLevel, message: string, meta?: unknown): void {
  const payload = meta === undefined ? message : `${message} ${JSON.stringify(meta)}`;
  const line = `[${stamp()}] [${level.toUpperCase()}] ${payload}`;
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (m: string, meta?: unknown) => write('info', m, meta),
  warn: (m: string, meta?: unknown) => write('warn', m, meta),
  error: (m: string, meta?: unknown) => write('error', m, meta),
  debug: (m: string, meta?: unknown) => write('debug', m, meta),
};
