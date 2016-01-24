/*
 * web-payments.io development server starter.
 *
 * Copyright (c) 2016 Spec Ops. All rights reserved.
 */
var bedrock = require('bedrock');

require('./lib/main');
require('./configs/dev');

// configure for tests
bedrock.events.on('bedrock.test.configure', function() {
  require('./configs/test');
});

bedrock.start();
