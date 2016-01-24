define([
  'angular',
  './payment-request-controller',
  './register-controller'
], function(
  angular,
  paymentRequestController,
  registerController) {

'use strict';

var module = angular.module('web-payments-demo.first-pay', ['bedrock.alert']);

module.controller(paymentRequestController);
module.controller(registerController);

/* @ngInject */
module.config(function($routeProvider) {
  $routeProvider
    .when('/first-pay/register', {
      title: 'Register FirstPay',
      templateUrl: requirejs.toUrl(
        'web-payments-demo/first-pay/register.html')
    })
    .when('/first-pay', {
      title: 'FirstPay',
      templateUrl: requirejs.toUrl(
        'web-payments-demo/first-pay/payment-request.html')
    });
});

return module.name;

});
