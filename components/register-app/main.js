define([
  'angular',
  './register-app-controller'
], function(
  angular,
  registerAppController) {

'use strict';

var module = angular.module(
  'web-payments.io.registerApp',
  ['web-payments.io.paymentMediator', 'bedrock.alert']);

module.controller(registerAppController);

/* @ngInject */
module.config(function($routeProvider) {
  $routeProvider
    .when('/register', {
      title: 'Register Payment App',
      templateUrl: requirejs.toUrl(
        'web-payments.io/register-app/register-app.html')
    });
});

return module.name;

});
