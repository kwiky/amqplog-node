# amqplog
A logger through amqp.

Each log call generates an amqp message.

## Usage

```javascript
var options = {
  host: 'locahost'
};

var logger = require('amqplog').connect(options);

logger.i('this is an info message');
logger.d('this is a debug message');
logger.w('this is a warn message');
logger.e('this is an error message');
```


### Available Options
All options are optional:

* `host` {String} Hostname. Default: `localhost`.
* `port` {Number} Port. Default: `5672`.
* `user` {String} Username. Default: none.
* `pass` {String} Password. Default: none.
* `queue` {String} Queue name. Default: `logs`.
* retryDelay {Number} Delay in seconds before retry to connect to the server. Default: `5`.
* `vhost` {String} Vhost. Default: none.
