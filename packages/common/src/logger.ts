export class Logger {
  static shouldLog = process.env.NODE_ENV === "development";

  static log(message: string) {
    if (Logger.shouldLog) {
      // get caller line number
      const stack = new Error().stack;
      if (stack) {
        const callerLine = stack.split("\n")[2];
        console.log(`[${callerLine?.trim()}] ${message}`);
      } else {
        console.log(message);
      }
    }
  }
}
