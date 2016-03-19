var opts = {
  host: "192.168.99.100"
};

var logger = require('../').connect(opts);

function emitLogs() {
  console.log('Emitting logs...');
  logger.i('this is an info message');
  logger.d('this is a debug message');
  logger.w('this is a warn message');
  logger.e('this is an error message');
}

setInterval(emitLogs, 1000);
