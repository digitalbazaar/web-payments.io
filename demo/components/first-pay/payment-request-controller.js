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
    console.log('request', request);
    self.request = request;
  }).catch(function(err) {
    brAlertService.add('error', err);
  }).then(function() {
    self.loading = false;
    $scope.$apply();
  });

  self.complete = function(instrument) {
    // TODO: include chosen instrument in acknowledgement for clear CC passthru?

    // demo acknowledgement from spec
    var acknowledgement = {
      type: 'PaymentAcknowledgement',
      description: self.request.description,
      payment: {
        paymentMethod: 'https://w3id.org/payment-methods#Visa',
        status: 'authorized',
        approvalCode: '10025AB',
        paymentAmount: {
          amount: '4.35',
          currency: 'USD'
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

return {fpPaymentRequestController: factory};

});
