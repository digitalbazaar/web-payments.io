/*
 * web-payments.io default configuration.
 *
 * Copyright (c) 2016 Spec Ops. All rights reserved.
 */
var config = require('bedrock').config;
var path = require('path');

// location of logs
var _logdir = '/tmp/web-payments.io';

// core
// 0 means use # of cpus
config.core.workers = 1;
config.core.master.title = 'wpio1d';
config.core.worker.title = 'wpio1d-worker';
config.core.worker.restart = false;

// logging
config.loggers.app.filename =
  path.join(_logdir, 'web-payments.dev-app.log');
config.loggers.access.filename =
  path.join(_logdir, 'web-payments.dev-access.log');
config.loggers.error.filename =
  path.join(_logdir, 'web-payments.dev-error.log');
config.loggers.email.silent = true;
config.loggers.email.to = ['cluster@web-payments.io'];
config.loggers.email.from = 'cluster@web-payments.io';

// server info
config.server.port = 53443;
config.server.httpPort = 53080;
config.server.bindAddr = ['web-payments.dev'];
config.server.domain = 'web-payments.dev';
config.server.host = 'web-payments.dev:53443';
config.server.baseUri = 'https://' + config.server.host;

// express info
config.express.session.secret = 'NOTASECRET';
config.express.session.key = 'web-payments.io.sid';
config.express.session.prefix = 'web-payments.io.';

// requirejs
// web-payments.io pseudo bower package
config.requirejs.bower.packages.push({
  path: path.join(__dirname, '../components'),
  manifest: {
    name: 'web-payments.io',
    moduleType: 'amd',
    main: './main.js',
    dependencies: {
      angular: '~1.3.0'
    }
  }
});

// views
// branding
config.views.brand.name = 'web-payments.io Development';

// update view vars
config.views.vars.baseUri = config.server.baseUri;
config.views.vars.title = config.views.brand.name;
config.views.vars.siteTitle = config.views.brand.name;
config.views.vars.supportDomain = config.server.domain;
config.views.vars.debug = false;
config.views.vars.footer.show = false;
// FIXME: add logo img
config.views.vars.style.brand.alt = config.views.brand.name;
config.views.vars.style.brand.src = null;//'/img/brand.png';
//config.website.views.vars.style.brand.height = '24';
//config.website.views.vars.style.brand.width = '25';
// contact info
config.views.vars.contact.address = {
  label: 'Spec Ops',
  address:
    '123 FIXME\n' +
    'FIXME, XX 12345\n' +
    'United States of America',
  htmlAddress:
    '123 FIXME<br/>' +
    'FIXME, XX 12345<br/>' +
    'United States of America'
};

// web-payments.io config
config.views.vars['web-payments.io'] = {};
