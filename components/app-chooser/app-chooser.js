define([
  'angular',
  './app-chooser-directive'
], function(angular, appChooserDirective) {

'use strict';

var module = angular.module('web-payments.io.appChooser', ['bedrock.alert']);

module.directive(appChooserDirective);

return module.name;

});
