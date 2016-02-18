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
      id: url,
      type: 'PaymentApp',
      name: 'FirstPay',
      //image: url + '/app.png',
      image: 'https://cdn.rawgit.com/google/material-design-icons/182053460b9e96cab11924c0b50dcb50dc8d5366/action/2x_web/ic_credit_card_black_48dp.png',
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

return {fpRegisterController: factory};

});
