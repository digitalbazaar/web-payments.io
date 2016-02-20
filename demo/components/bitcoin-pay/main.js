define([
  'angular',
  './payment-request-controller',
  './register-controller'
], function(
  angular,
  paymentRequestController,
  registerController) {

'use strict';

var module = angular.module('web-payments-demo.bitcoin-pay', ['bedrock.alert']);

module.controller(paymentRequestController);
module.controller(registerController);

/* @ngInject */
module.config(function($routeProvider) {
  $routeProvider
    .when('/bitcoin-pay/register', {
      title: 'Register BitcoinPay',
      templateUrl: requirejs.toUrl(
        'web-payments-demo/bitcoin-pay/register.html')
    })
    .when('/bitcoin-pay', {
      title: 'BitcoinPay',
      templateUrl: requirejs.toUrl(
        'web-payments-demo/bitcoin-pay/payment-request.html')
    });
});

return module.name;

});
