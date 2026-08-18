const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}`;
};

const logger = {
  info(message) {
    console.log(formatMessage("INFO", message));
  },

  warn(message) {
    console.warn(formatMessage("WARN", message));
  },

  error(message, error = null) {
    const details = error?.message ? ` - ${error.message}` : "";
    console.error(formatMessage("ERROR", `${message}${details}`));
  },

  debug(message) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(formatMessage("DEBUG", message));
    }
  },
};

module.exports = logger;
