define([
  'angular',
  './cart-controller'
], function(angular, cartController) {

'use strict';

var module = angular.module('web-payments-demo.payee', ['bedrock.alert']);

module.controller(cartController);

/* @ngInject */
module.config(function($routeProvider) {
  $routeProvider
    .when('/payee', {
      title: 'Shopping Cart',
      templateUrl: requirejs.toUrl('web-payments-demo/payee/cart.html')
    });
});

return module.name;

});
