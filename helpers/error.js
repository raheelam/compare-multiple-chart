export const terminate = (
  server,
  options = { coredump: false, timeout: 1000 }
) => {
  // Exit function
  const exit = (code) => {
    options.coredump ? process.abort() : process.exit(code);
  };

  return (code, reason) => (err, promise) => {
    if (err && err instanceof Error) {
      // Log error information, using a proper error library(probably winston)
      console.log(err.message, err.stack);
    }

    // Attempt a graceful shutdown
    server.close(exit);
    setTimeout(exit, options.timeout).unref();
  };
};

export const errorHandler = (message, error) => {
  if (!error) error = Error(message);
  return { message, error };
};
