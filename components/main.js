define([
  'angular',
  './payment-mediator/main',
  './app-chooser/app-chooser',
  './register-app/main'
], function(angular) {

'use strict';

var module = angular.module(
  'web-payments.io', Array.prototype.slice.call(arguments, 1));

return module.name;

});
