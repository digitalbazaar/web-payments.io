define([
  'angular',
  './agent/main',
  './payment-mediator/main',
  './app-chooser/main',
  './register-app/main'
], function(angular) {

'use strict';

var module = angular.module(
  'web-payments.io', Array.prototype.slice.call(arguments, 1));

return module.name;

});
