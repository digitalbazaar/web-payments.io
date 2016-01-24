/*
 * Main module file for web-payments.io.
 *
 * Copyright (c) 2016 Spec Ops. All rights reserved.
 */
var bedrock = require('bedrock');
require('bedrock-express');
require('bedrock-protractor');
require('bedrock-requirejs');
require('bedrock-server');
require('bedrock-views');

require('./config');

var api = {};
module.exports = api;
