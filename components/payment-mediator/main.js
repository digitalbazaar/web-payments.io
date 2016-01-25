define([
  'angular',
  './flow-service',
  './payment-app-service',
  './payment-mediator-controller'
], function(
  angular, flowService, paymentAppService, paymentMediatorController) {

'use strict';

var module = angular.module(
  'web-payments.io.paymentMediator',
  ['web-payments.io.appChooser', 'bedrock.alert']);

module.controller(paymentMediatorController);
module.service(flowService);
module.service(paymentAppService);

/* @ngInject */
module.config(function($routeProvider) {
  $routeProvider
    .when('/mediator', {
      title: 'Payment Request',
      templateUrl: requirejs.toUrl(
        'web-payments.io/payment-mediator/payment-request.html')
    });
});

return module.name;

});
