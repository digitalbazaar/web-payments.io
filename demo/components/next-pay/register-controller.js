define([], function() {

'use strict';

/* @ngInject */
function factory($scope, $location, brAlertService) {
  var self = this;
  self.loading = false;

  self.register = function() {
    self.loading = true;
    // remove trailing "/register"
    var url = $location.absUrl();
    url = url.substr(0, url.length - '/register'.length);
    navigator.payment.registerApp({
      '@context': 'https://w3id.org/web-payments/v1',
      id: url,
      type: 'PaymentApp',
      name: 'NextPay',
      image: url + '/app.png',
      url: url,
      supportedPaymentMethod: [
        'https://w3id.org/payment-methods#Visa',
        'https://w3id.org/payment-methods#MasterCard'
      ]
    }, {
      agentUrl: '/register'
    }).then(function() {
      // success, redir to demo page
      $location.path('/');
    }).catch(function(err) {
      brAlertService.add('error', err);
    }).then(function() {
      self.loading = false;
      $scope.$apply();
    });
  };
}

return {npRegisterController: factory};

});
