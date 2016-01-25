define(['jsonld', 'lodash'], function(jsonld, _) {

'use strict';

/* @ngInject */
function factory(
  $location, $scope,
  wpioPaymentAppService, wpioFlowService, brAlertService) {
  var self = this;
  self.manifests = {};
  self.display = {};
  var query = $location.search();

  /**
   * Resumes the flow by proxying a message. This function is called
   * for a `request` operation after a payment app is chosen.
   *
   * @param err an error if one occurred.
   * @param manifest set to the manifest for the selected app.
   */
  self.complete = function(err, manifest) {
    if(err) {
      return brAlertService.add('error', err);
    }
    wpioFlowService.setApp(manifest);
    // go to payment app to handle request
    return wpioFlowService.navigateToApp(manifest);
  };

  /**
   * Cancels sending any information to the RP.
   */
  self.cancel = function() {
    wpioFlowService.sendResult(null);
  };

  // we're receiving parameters from the RP or sending them to the app
  if(query.route === 'params') {
    if(wpioFlowService.needsParameters(query)) {
      // flow is just starting, clear old app and get parameters from RP
      wpioFlowService.clearApp();
      return wpioFlowService.getParameters(query)
        .then(function(params) {
          // get acceptable payment methods
          var request = params.paymentRequest;
          var acceptable = jsonld.getValues(request, 'acceptablePayment');
          acceptable = _.map(acceptable, function(e) {
            return e.paymentMethod;
          });
          // get matching payment apps
          var matches = wpioPaymentAppService.match({
            paymentMethods: acceptable
          });
          // show app chooser
          self.manifests = matches;
          self.display.appChooser = true;
          $scope.$apply();
          return;
        });
    }

    // already have parameters, we're invisibly proxing them to the app
    return wpioFlowService.proxy(query);
  }

  // we're receiving the result from the app or sending it to the RP
  if(query.route === 'result') {
    if(wpioFlowService.needsResult(query)) {
      // no result received from app yet, we're invisibly proxying it and
      // then we'll reload as the main application in the flow to do something
      // further with the result
      return wpioFlowService.proxy(query);
    }

    // proxy the result w/o need to confirm
    self.display.redirectOrigin = query.origin;
    return wpioFlowService.proxy(query);
  }

  // TODO: handle invalid query
}

return {wpioPaymentMediatorController: factory};

});
