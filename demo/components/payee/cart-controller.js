define([], function() {

'use strict';

/* @ngInject */
function factory($scope, $window, brAlertService, config) {
  var self = this;
  self.view = 'request';

  self.request = function() {
    navigator.payment.request({
      '@context': 'https://w3id.org/web-payments/v1',
      type: 'PaymentRequest',
      description: 'Payment to ExampleMerch for widgets',
      acceptablePayment: {
        paymentMethod: 'https://w3id.org/payment-methods#Visa',
        transfer: {
          amount: '4.35',
          currency: 'USD'
        }
      },
      signature: {
        type: 'LinkedDataSignature2015',
        creator: 'https://payee.example.com/keys/23',
        created: '2015-09-23T20:21:34Z',
        nonce: '239807882930744354',
        signatureValue: '4NTIyOGQzNGVkMzVmZTkZ...3Q3ODgoYzI4IyOWM32NjI='
      }
    }, {
      agentUrl: '/mediator'
    }).then(function(acknowledgement) {
      self.acknowledgement = acknowledgement;
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
