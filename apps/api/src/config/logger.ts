import path from 'node:path';
import { cwd } from 'node:process';
import { createLogger, format, transports } from 'winston';
import winstonDaily, {
  type DailyRotateFileTransportOptions,
} from 'winston-daily-rotate-file';

const { combine, timestamp, colorize, printf } = format;
const logDir = path.join(cwd(), 'logs');
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const ignorePrivate = format((info) => (info.private ? false : info));

/** Custom logging format */
const formatStackTrace = (stack: string, limit = 3) => {
  const [errorMessage, ...restLines] = stack.split('\n');
  return [
    errorMessage.replace(/(\w+):/g, '[$1]'), // "Error: This is ..." -> "[Error] This is ..."
    ...restLines.slice(0, limit).map((line) => `-> ${line}`),
  ].join('\n');
};

const customFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let logMessage = `[${timestamp}] [${level}]: ${message}`;

  if (typeof stack === 'string' && stack.trim().length > 0) {
    logMessage += `\nStack: ${formatStackTrace(stack)}`;
  }

  if (Object.keys(meta).length > 0) {
    const metaInfo = JSON.stringify(meta, null, 2);
    logMessage += `\nMeta: ${metaInfo}`;
  }

  return logMessage;
});

/** Transform log level to uppercase */
const uppercaseLevel = format((info) => {
  info.level = info.level.toUpperCase();
  return info;
});

type LogLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';

/** Generate configuration for daily rotating files based on level and filename */
const dailyRotateFileConfig = (
  level: LogLevel,
  filename: string,
): DailyRotateFileTransportOptions => ({
  level,
  datePattern: 'YYYY-MM-DD',
  dirname: logDir,
  filename: `%DATE%${filename}.log`,
  maxFiles: '7d', // Keep logs for 7 days
  maxSize: '5m', // Max size of each log file
  zippedArchive: true,
});

export const logger = createLogger({
  format: combine(
    ignorePrivate(),
    uppercaseLevel(),
    timestamp({ format: DATE_FORMAT }),
    customFormat,
  ),
  transports: [
    new winstonDaily(dailyRotateFileConfig('info', '')),
    new winstonDaily({
      ...dailyRotateFileConfig('error', '.error'),
      dirname: path.join(logDir, 'error'), // Override dirname for error logs
    }),
    new transports.Console({
      format: combine(colorize(), customFormat),
    }),
  ],
  exceptionHandlers: [
    new winstonDaily(dailyRotateFileConfig('error', '.exception')),
  ],
});
