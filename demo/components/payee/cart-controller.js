define([], function() {

'use strict';

/* @ngInject */
function factory($scope, $window, brAlertService, config) {
  var self = this;
  self.view = 'request';

  self.request = function() {
    navigator.payment.request({
      type: 'PaymentRequest',
      description: 'Payment to ExampleMerch for widgets',
      acceptablePayment: [{
        paymentMethod: 'https://w3id.org/payment-methods#Visa',
        paymentAmount: {
          amount: '4.35',
          currency: 'USD'
        }
      }, {
        paymentMethod: 'https://w3id.org/payment-methods#Bitcoin',
        paymentAmount: {
          amount: '0.0177',
          currency: 'BTC'
        },
        paymentAddress: 'bitcoin:175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W'
      }]
    }, {
      agentUrl: '/mediator'
    }).then(function(acknowledgement) {
      self.acknowledgement = acknowledgement;

      // check payment method selected
      // TODO: if bitcoin, wait for a number of confirmations (blocks)

      self.view = 'acknowledgement';
    }).catch(function(err) {
      brAlertService.add('error', err);
    }).then(function() {
      $scope.$apply();
    });
  };

  self.home = function() {
    $window.location = config.data.baseUri;
  };
}

return {pCartController: factory};

});
