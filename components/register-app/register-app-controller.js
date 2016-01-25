define([], function() {

'use strict';

/* @ngInject */
function factory(
  $location, $scope, wpioPaymentAppService, brAlertService) {
  var self = this;
  self.loading = false;

  // get register parameters
  self.loading = true;
  var origin = $location.search().origin;
  var router = new navigator.payment._Router('params', origin);
  router.request('registerApp').then(function(message) {
    // TODO: handle other parameters
    self.origin = message.origin;
    self.app = message.data;
  }).catch(function(err) {
    brAlertService.add('error', err);
  }).then(function() {
    self.loading = false;
    $scope.$apply();
  });

  self.register = function() {
    wpioPaymentAppService.install(self.app);
    var router = new navigator.payment._Router('result', origin);
    router.send('registerApp', self.app);
  };
}

return {wpioRegisterAppController: factory};

});
