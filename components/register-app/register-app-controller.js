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
    self.app = message.data.app;
  }).catch(function(err) {
    brAlertService.add('error', err);
  }).then(function() {
    self.loading = false;
    $scope.$apply();
  });

  self.install = function() {
    self.loading = true;
    wpioPaymentAppService.install({
      app: self.app
    }).then(function() {
      var router = new navigator.credentials._Router('result', origin);
      router.send('registerApp', self.app);
    }).catch(function(err) {
      self.loading = false;
      console.error('Failed to install payment app.', err);
      brAlertService.add('error', 'Failed to register payment app.');
    }).then(function() {
      $scope.$apply();
    });
  };
}

return {wpioRegisterAppController: factory};

});
