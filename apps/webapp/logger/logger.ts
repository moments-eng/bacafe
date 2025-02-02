import * as winston from "winston";

/**
 * Parameters required for Coralogix transport configuration.
 */
interface LoggerParams {
  coralogixApiKey: string;
  host: string;
}

const isProduction: boolean = process.env.NODE_ENV === "production";

const createCoralogixTransport = ({
  coralogixApiKey,
  host,
}: LoggerParams): winston.transport => {
  return new winston.transports.Http({
    level: "info",
    format: winston.format.combine(
      winston.format((info) => {
        const { level, message, ...payload } = info;
        return {
          level,
          message,
          applicationName: isProduction ? "production" : "development",
          subsystemName: "bacafe-webapp",
          computerName: host,
          timestamp: Date.now(),
          severity:
            (
              {
                silly: 1,
                debug: 1,
                verbose: 2,
                info: 3,
                warn: 4,
                error: 5,
                critical: 6,
              } as Record<string, number>
            )[level] || 3,
          text: { message, ...payload },
          payload,
        };
      })(),
      winston.format.json()
    ),
    host: "ingress.cx498.coralogix.com",
    path: "logs/v1/singles",
    headers: {
      authorization: `Bearer ${coralogixApiKey}`,
    },
    ssl: true,
    batchInterval: 1000,
    handleExceptions: true,
  });
};

/**
 * Logger class that wraps winston for JSON logging with optional Coralogix HTTP transport.
 */
class Logger {
  private logger: winston.Logger;
  private static instance: Logger;

  /**
   * Creates a new Logger instance.
   * @param options - Optional configuration containing Coralogix API key and host.
   */
  private constructor() {
    const coralogixApiKey = process.env.CORALOGIX_API_KEY;
    const host = process.env.HOSTNAME;
    const transports: winston.transport[] = [];

    // Console transport
    transports.push(
      new winston.transports.Console({
        format: isProduction
          ? winston.format.json()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp(),
              winston.format.printf(
                ({ timestamp, level, message }) =>
                  `${timestamp} ${level}: ${message}`
              )
            ),
      })
    );

    // HTTP transport for Coralogix if in production and configuration provided
    if (isProduction && coralogixApiKey && host) {
      transports.push(
        createCoralogixTransport({
          coralogixApiKey: coralogixApiKey,
          host: host,
        })
      );
    }

    this.logger = winston.createLogger({
      level: "info",
      transports,
    });
  }

  /**
   * Returns a singleton instance of Logger.
   * @param options - Optional configuration containing Coralogix API key and host.
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log an informational message.
   * @param message - The log message.
   * @param meta - Additional metadata.
   */
  public info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, meta);
  }

  /**
   * Log a debug message.
   * @param message - The log message.
   * @param meta - Additional metadata.
   */
  public debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, meta);
  }

  /**
   * Log a warning message.
   * @param message - The log message.
   * @param meta - Additional metadata.
   */
  public warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, meta);
  }

  /**
   * Log an error message.
   * @param message - The log message.
   * @param meta - Additional metadata.
   */
  public error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error(message, meta);
  }
}

export default Logger;
