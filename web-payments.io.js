/*
 * web-payments.io production server.
 *
 * Copyright (c) 2016 Spec Ops. All rights reserved.
 */
var bedrock = require('bedrock');

require('./lib/main');
require('./configs/web-payments.io');

bedrock.start();
