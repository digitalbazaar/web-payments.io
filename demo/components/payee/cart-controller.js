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
      acceptablePayment: {
        paymentMethod: 'https://w3id.org/payment-methods#Visa',
        paymentAmount: {
          amount: '4.35',
          currency: 'USD'
        }
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
