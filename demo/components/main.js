define([
  'angular',
  './first-pay/main',
  './next-pay/main',
  './bitcoin-pay/main',
  './payee/main',
], function(angular) {

'use strict';

var module = angular.module('web-payments-demo', [
  'web-payments-demo.first-pay', 'web-payments-demo.next-pay',
  'web-payments-demo.bitcoin-pay', 'web-payments-demo.payee']);

/* @ngInject */
module.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      title: 'Welcome',
      templateUrl: requirejs.toUrl('web-payments-demo/welcome.html')
    });
});

return module.name;

});
