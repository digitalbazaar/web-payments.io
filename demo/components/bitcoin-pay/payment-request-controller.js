define([], function() {

'use strict';

/* @ngInject */
function factory($scope, brAlertService) {
  var self = this;
  self.request = null;
  self.instrument = null;
  self.loading = true;

  navigator.payment.getPendingRequest({
    agentUrl: '/mediator'
  }).then(function(request) {
    self.request = request;
  }).catch(function(err) {
    brAlertService.add('error', err);
  }).then(function() {
    self.loading = false;
    $scope.$apply();
  });

  self.complete = function(instrument) {
    // demo acknowledgement
    var acknowledgement = {
      '@context': 'https://w3id.org/web-payments/v1',
      type: 'PaymentAcknowledgement',
      description: self.request.description,
      payment: {
        paymentMethod: 'https://w3id.org/payment-methods#Bitcoin',
        status: 'confirmed',
        txId: '263c018582731ff54dc72c7d67e858c002ae298835501d80200f05753de0edf0',
        paymentAmount: {
          amount: '0.0177',
          currency: 'BTC'
        }
      }
    };

    navigator.payment.acknowledge(acknowledgement, {
      agentUrl: '/mediator'
    }).catch(function(err) {
      console.error('Failed to acknowledge payment.', err);
      brAlertService.add('error', 'Failed to acknowledge payment.');
    }).then(function() {
      $scope.$apply();
    });
  };
}

return {bpPaymentRequestController: factory};

});
