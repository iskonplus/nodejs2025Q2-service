import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly levels: LogLevel[] = [
    'error',
    'warn',
    'log',
    'debug',
    'verbose',
    'fatal',
  ];

  private format(
    level: string,
    message: any,
    context?: string,
    trace?: string,
  ): string {
    const time = new Date().toISOString();
    const ctx = context ? `[${context}] ` : '';
    const msg = typeof message === 'string' ? message : JSON.stringify(message);

    let base = `${time} ${level} ${ctx}${msg}`;
    if (trace) {
      base += `\nTRACE: ${trace}`;
    }

    return base;
  }

  private readonly activeLevels: Set<LogLevel>;

  private isLevelEnabled(level: LogLevel): boolean {
    return this.activeLevels.has(level);
  }

  constructor() {
    const envLevel = (process.env.LOG_LEVEL ?? 'log').toLowerCase() as LogLevel;

    const idx = this.levels.indexOf(envLevel);
    const enabledLevels =
      idx === -1 ? ['error', 'warn', 'log'] : this.levels.slice(0, idx + 1);

    this.activeLevels = new Set(enabledLevels as LogLevel[]);
  }

  log(message: any, context?: string) {
    if (!this.isLevelEnabled('log')) return;
    console.log(this.format('LOG', message, context));
  }

  error(message: any, trace?: string, context?: string) {
    if (!this.isLevelEnabled('error')) return;
    console.error(this.format('ERROR', message, context, trace));
  }

  warn(message: any, context?: string) {
    if (!this.isLevelEnabled('warn')) return;
    console.warn(this.format('WARN', message, context));
  }

  debug(message: any, context?: string) {
    if (!this.isLevelEnabled('debug')) return;
    console.debug(this.format('DEBUG', message, context));
  }

  verbose(message: any, context?: string) {
    if (!this.isLevelEnabled('verbose')) return;
    console.debug(this.format('VERBOSE', message, context));
  }
  fatal(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('fatal')) return;
    const trace = optionalParams.length ? optionalParams.join(' ') : undefined;
    console.error(this.format('FATAL', message, undefined, trace));
  }
}
