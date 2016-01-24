define([], function() {

'use strict';

/* @ngInject */
function factory() {
  return {
    restrict: 'E',
    scope: {
      apps: '=?wpioAppChooserApps',
      callback: '&wpioAppChooserCallback'
    },
    controller: function() {},
    controllerAs: 'ctrl',
    bindToController: true,
    link: Link,
    templateUrl: requirejs.toUrl('web-payments.io/app-chooser/app-chooser.html')
  };

  function Link(scope, element, attrs, ctrl) {
    ctrl.selected = null;
    ctrl.select = function(manifest) {
      ctrl.selected = manifest.id;
      ctrl.callback({err: null, app: manifest});
    };
  }
}

return {wpioAppChooser: factory};

});
