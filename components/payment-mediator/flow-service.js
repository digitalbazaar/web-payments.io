define([], function() {

'use strict';

/* @ngInject */
function factory($window, wpioPaymentAppService) {
  var service = {};

  var STORAGE_KEYS = {
    OPERATION: 'web-payments.io.flow.operation.',
    APP: 'web-payments.io.flow.app'
  };

  var Router = navigator.payment._Router;

  /**
   * Returns true if the current operation's parameters need to be received.
   *
   * @return true if parameters need to be received, false if not.
   */
  service.needsParameters = function() {
    return !_load('params');
  };

  /**
   * Returns true if the current operation's result needs to be received.
   *
   * @return true if the result needs to be received, false if not.
   */
  service.needsResult = function() {
    return !_load('result');
  };

  /**
   * Gets the parameters for the given operation. This method will
   * request the parameters from the caller.
   *
   * @param options the options to use:
   *          op the name of the operation to receive parameters for.
   *          origin the origin to receive from.
   *
   * @return a Promise that resolves to the parameters for the operation.
   */
  service.getParameters = function(options) {
    var router = new Router('params', options.origin);
    return router.request(options.op).then(function(message) {
      _save(options.op, 'params', message);
      return message.data;
    });
  };

  /**
   * Gets the result for the given operation. This method will return
   * the locally-cached result.
   *
   * @param options the options to use:
   *          op the name of the operation to get the result for.
   *          origin the origin to receive from.
   *
   * @return the destination origin, original params, and result for the
   *   operation: `{origin: ..., params: ..., result: ...}`.
   */
  service.getResult = function(options) {
    var rpMessage = _load('params');
    var appMessage = _load('result');
    if(!rpMessage || !appMessage || appMessage.origin !== options.origin) {
      throw new Error('Payment protocol error.');
    }
    return {
      origin: rpMessage.origin,
      params: rpMessage.data,
      result: appMessage.data
    };
  };

  /**
   * Navigates to the Payment App.
   *
   * @param manifest the payment app manifest to use.
   */
  service.navigateToApp = function(manifest) {
    $window.location.replace(manifest.url);
  };

  /**
   * Sends an acknowledgement to the RP as the result of a request.
   *
   * @param acknowledgement the acknowledgement to send.
   */
  service.sendResult = function(acknowledgement) {
    var rpMessage = _load('params');
    if(!rpMessage) {
      throw new Error('Payment protocol error.');
    }
    _save('request', 'result', {
      origin: rpMessage.origin,
      data: acknowledgement
    });
    service.proxy({
      op: 'request',
      route: 'result',
      origin: rpMessage.origin
    });
  };

  /**
   * Selects the payment app for the current payment flow. Only one app can be
   * set at a time.
   *
   * @param manifest the manifest for the payment app.
   *
   * @return the manifest.
   */
  service.setApp = function(manifest) {
    // TODO: error check
    sessionStorage.setItem(STORAGE_KEYS.APP, JSON.stringify(manifest));
    return manifest;
  };

  /**
   * Gets the manifest for the selected payment app, if one exists.
   *
   * @return the manifest, null if none exists.
   */
  service.getApp = function() {
    var manifest = sessionStorage.getItem(STORAGE_KEYS.APP);
    if(!manifest) {
      return null;
    }
    try {
      manifest = JSON.parse(manifest);
    } catch(err) {
      return null;
    }
    return manifest;
  };

  /**
   * Clears the currently selected payment app, if one was set.
   */
  service.clearApp = function() {
    sessionStorage.removeItem(STORAGE_KEYS.APP);
  };

  /**
   * Proxies a message based on the given options. If there is a pending
   * message in session storage for the given options, it will be sent, if
   * there isn't, one will be received and stored and then navigation will
   * occur to handle that message.
   *
   * This call handles messages when no user-mediation is required.
   *
   * @param options the options to use:
   *          op the name of the operation to proxy messages for.
   *          origin the origin to receive from.
   */
  service.proxy = function(options) {
    var message = _load(options.route);
    var manifest = service.getApp();
    if(!manifest) {
      // TODO: need better error handling for missing sessions
      // and for different scenarios (web-payments.io loaded
      // invisibly vs. visibly)
      var origin = (options.route === 'params' ?
        options.origin : message.origin);
      new Router(options.route, origin).send('error');
      return;
    }
    if(message) {
      // TODO: need better error handling during _send, perhaps simply
      // catch (and ensure _send returns a promise) and route an error
      // new Router(options.route, origin).send('error');
      return _send(manifest, message, options);
    }
    return _receive(options);
  };

  // TODO: document helpers

  function _send(manifest, message, options) {
    var appUrl = manifest.url;

    if(options.route === 'params') {
      // payment mediator sending to payment app...
      if(_parseOrigin(appUrl) !== options.origin) {
        throw new Error('Origin mismatch.');
      }
      var router = new Router(options.route, options.origin);

      // build params to send from message data
      var params = {};
      params.options = {};
      params.options.request = message.data;
      return router.send(message.op, params);
    }

    // payment mediator sending to RP...
    if(message.origin !== options.origin) {
      throw new Error('Origin mismatch.');
    }

    // get RP origin to route to it
    var rpMessage = _load('params');
    if(!rpMessage) {
      throw new Error('Payment protocol error.');
    }
    router = new Router(options.route, rpMessage.origin);

    // flow complete, clear selected app
    service.clearApp();

    // route message
    router.send(message.op, message.data);
  }

  function _receive(options) {
    var router = new Router(options.route, options.origin);
    router.request(options.op).then(function(message) {
      _save(options.op, options.route, message);
      // request navigation
      router.navigate();
    });
  }

  function _save(op, route, message) {
    sessionStorage.setItem(
      STORAGE_KEYS.OPERATION + route,
      JSON.stringify({
        origin: message.origin,
        op: op,
        data: message.data
      }));
  }

  function _load(route) {
    var item = sessionStorage.getItem(STORAGE_KEYS.OPERATION + route);
    if(item) {
      try {
        item = JSON.parse(item);
      } catch(err) {
        item = null;
      }
    }
    return item;
  }

  function _parseOrigin(url) {
    // `URL` API not supported on IE, use DOM to parse URL
    var parser = document.createElement('a');
    parser.href = url;
    return parser.protocol + '//' + parser.host;
  }

  return service;
}

return {wpioFlowService: factory};

});
