define([
  'angular',
  './payment-request-controller',
  './register-controller'
], function(
  angular,
  paymentRequestController,
  registerController) {

'use strict';

var module = angular.module('web-payments-demo.next-pay', ['bedrock.alert']);

module.controller(paymentRequestController);
module.controller(registerController);

/* @ngInject */
module.config(function($routeProvider) {
  $routeProvider
    .when('/next-pay/register', {
      title: 'Register NextPay',
      templateUrl: requirejs.toUrl(
        'web-payments-demo/next-pay/register.html')
    })
    .when('/next-pay', {
      title: 'NextPay',
      templateUrl: requirejs.toUrl(
        'web-payments-demo/next-pay/payment-request.html')
    });
});

return module.name;

});
