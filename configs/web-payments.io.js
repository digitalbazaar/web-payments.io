/*
 * web-payments.io production configuration.
 *
 * Copyright (c) 2016 Spec Ops. All rights reserved.
 */
var config = require('bedrock').config;
var path = require('path');

// location of configuration files
var _cfgdir = path.join(__dirname, '..');

// location of logs
var _logdir = '/var/log/web-payments.io';

// core configuration
config.core.workers = 1;
config.core.worker.restart = true;

// master process while starting
config.core.starting.groupId = 'adm';
config.core.starting.userId = 'root';

// master and workers after starting
config.core.running.groupId = 'webpayments';
config.core.running.userId = 'webpayments';

// logging
config.loggers.logdir = _logdir;
config.loggers.app.filename = path.join(_logdir, 'web-payments.io-app.log');
config.loggers.access.filename = path.join(
  _logdir, 'web-payments.io-access.log');
config.loggers.error.filename = path.join(
  _logdir, 'web-payments.io-error.log');
config.loggers.email.silent = true;

// server info
config.server.port = 443;
config.server.httpPort = 80;
config.server.bindAddr = ['web-payments.io'];
config.server.domain = 'web-payments.io';
config.server.host = 'web-payments.io';
config.server.baseUri = 'https://' + config.server.host;
config.server.key = path.join(_cfgdir, 'pki', 'web-payments.io.key');
config.server.cert = path.join(_cfgdir, 'pki', 'web-payments.io.crt');
config.server.ca = path.join(_cfgdir, 'pki', 'web-payments.io-bundle.crt');

// session info
config.express.session.key = 'web-payments.io.sid';
config.express.session.prefix = 'web-payments.io.';

// view variables
config.views.brand.name = 'web-payments.io';
config.views.vars.baseUri = config.server.baseUri;
config.views.vars.title = config.views.brand.name;
config.views.vars.siteTitle = config.views.brand.name;
config.views.vars.supportDomain = config.server.domain;
config.views.vars.style.brand.alt = config.views.brand.name;
config.views.vars.minify = true;

// FIXME: Everything below here is temporary for testing purposes

// pseudo bower package for demo components
config.requirejs.bower.packages.push({
  path: path.join(__dirname, '..', 'demo', 'components'),
  manifest: {
    name: 'web-payments-demo',
    moduleType: 'amd',
    main: './main.js',
    dependencies: {
      angular: '~1.3.0'
    }
  }
});

require('./web-payments.io-secrets');
