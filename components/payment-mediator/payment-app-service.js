define(['angular', 'jsonld', 'lodash'], function(angular, jsonld, _) {

'use strict';

/* @ngInject */
function factory() {
  var service = {};

  var STORAGE_KEYS = {
    APPS: 'web-payments.io.apps'
  };

  /**
   * Installs a new payment app.
   *
   * @param options the options to use:
   *          app the payment app manifest.
   */
  service.install = function(options) {
    options = options || {};
    // TODO: validate `options.app`
    if(!options.app || typeof options.app !== 'object') {
      throw new Error('options.app must be an object.');
    }
    storage.insert(options.app);
  };

  /**
   * Gets all app manifests that match the given options.
   *
   * @param options the options to use:
   *          paymentMethods the payment methods to match.
   *
   * @return a map of matching app manifests, keyed by ID.
   */
  service.match = function(options) {
    options = options || {};
    if(!options.paymentMethods || !angular.isArray(options.paymentMethods)) {
      throw new Error('options.paymentMethods must be an array.');
    }

    // return all manifests whose supported payment methods intersect with
    // the given payment methods
    var manifests = storage.getAll();
    var matches = {};
    for(var id in manifests) {
      var manifest = manifests[id];
      var supported = jsonld.getValues(manifest, 'supportedPaymentMethod');
      if(_.intersection(options.paymentMethods, supported).length > 0) {
        matches[manifest.id] = manifest;
      }
    }
    return matches;
  };

  var storage = service.apps = {};

  /**
   * Inserts an app manifest into storage.
   *
   * @param options the options to use:
   *          app the app manifest to insert.
   */
  storage.insert = function(options) {
    options = options || {};
    if(!options.app || typeof options.app !== 'object') {
      throw new Error('options.app must be a valid object.');
    }
    var manifests = storage.getAll(options);
    manifests[options.app.id] = options.app;
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(manifests));
  };

  /**
   * Gets a locally-stored app manifest by ID.
   *
   * @param id the ID of the app manifest to look for.
   *
   * @return the app manifest if found, null if not.
   */
  storage.get = function(id, options) {
    options = options || {};
    if(!id || typeof id !== 'string') {
      throw new Error('id must be a non-empty string.');
    }
    return storage.getAll(options)[id] || null;
  };

  /**
   * Gets all available app manifests.
   *
   * @param options the options to use.
   *
   * @return all available identities.
   */
  storage.getAll = function(options) {
    options = options || {};
    var manifests;
    localStorage.getItem(STORAGE_KEYS.APPS);
    if(manifests) {
      try {
        manifests = JSON.parse(manifests);
      } catch(err) {
        console.error('Could not parse locally-stored app manifests.');
        // TODO: wiping out manifests when they can't be parsed could be
        // very problematic, perhaps best to leave them alone any establish
        // new storage instead
        manifests = {};
      }
    } else {
      manifests = {};
    }
    return manifests;
  };

  return service;
}

return {wpioPaymentAppService: factory};

});
