define(['bignumber.js'], function(BigNumber) {

'use strict';

/* @ngInject */
function factory() {
  return {
    restrict: 'E',
    scope: {
      paymentRequest: '=?wpioAppChooserPaymentRequest',
      options: '=?wpioAppChooserOptions',
      callback: '&wpioAppChooserCallback'
    },
    controller: function() {},
    controllerAs: 'ctrl',
    bindToController: true,
    link: Link,
    templateUrl: requirejs.toUrl('web-payments.io/app-chooser/app-chooser.html')
  };

  function Link(scope, element, attrs, ctrl) {
    // TODO: need to use $watch if we want to handle dynamic changes
    // find cheapest price
    for(var id in ctrl.options) {
      var min = null;
      var acceptablePayment = ctrl.options[id].acceptablePayment;
      for(var i = 0; i < acceptablePayment.length; ++i) {
        // FIXME: currently ignores currency
        var paymentAmount = acceptablePayment[i].paymentAmount;
        var amount = new BigNumber(paymentAmount.amount);
        if(!min || amount.compareTo(min) < 0) {
          min = amount;
          ctrl.options[id].min = paymentAmount;
        }
      }
    }

    ctrl.selected = null;
    ctrl.select = function(manifest) {
      ctrl.selected = manifest.id;
      ctrl.callback({err: null, app: manifest});
    };
  }
}

return {wpioAppChooser: factory};

});
