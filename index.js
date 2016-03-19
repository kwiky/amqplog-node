var amqp = require('amqplib');
var moment = require('moment');

module.exports = {

  levels: {
    INFO: 'info',
    DEBUG: 'debug',
    WARN: 'warn',
    ERROR: 'error'
  },

  connected: false,

  connectionUri: null,

  channel: null,

  waitingLogs: [],

  options: {},

  connect: function(opts) {
    var self = this;

    self.options.host = opts.host || 'localhost';
    self.options.port = opts.port || 5672;

    self.options.authority = '';
    if (opts.user) {
      self.options.authority = opts.user;
      if (opts.user) {
        self.options.authority += opts.pass + ':';
      }
      self.options.authority += '@';
    }

    self.options.vhost = '';
    if (opts.vhost) {
      self.options.vhost = '/' + opts.vhost;
    }

    self.options.retryDelay = opts.retryDelay || 5;

    self.connectionUri = 'amqp://' + self.options.authority + self.options.host + ':' + self.options.port + self.options.vhost;

    self.connected = amqp.connect(self.connectionUri);

    self.connected.then(function(conn) {
      var ok = conn.createChannel();
      ok = ok.then(function(ch) {
        var ok = ch.assertQueue(self.options.queue || 'logs', {durable: true});
        return ok.then(function() {
          self.channel = ch;
          for (var i = 0; i < self.waitingLogs.length; i++) {
            self.log(self.waitingLogs[i]);
          }
          self.waitingLogs = [];
        });
      });
      return ok;
    }, function(err) {
      console.log("Failed to connect to host " + self.options.host + '. Retry in ' + self.options.retryDelay + ' seconds...');
      setTimeout(function() {
        self.connect(self.options);
      }, self.options.retryDelay * 1000);
    });

    return self;
  },

  log: function(message, level) {
    var data = this.factory(message);
    if (!this.channel) {
      this.waitingLogs.push(data);
    } else {
      this.channel.sendToQueue('logs', new Buffer(data));
    }
  },

  i: function(message) {
    this.log(message, this.levels.INFO);
  },

  d: function(message) {
    this.log(message, this.levels.DEBUG);
  },

  w: function(message) {
    this.log(message, this.levels.WARN);
  },

  e: function(message) {
    this.log(message, this.levels.ERROR);
  },

  factory: function(message, level) {
    return JSON.stringify({
      time: moment(),
      level: level || this.levels.INFO,
      message: message
    });
  }
};
