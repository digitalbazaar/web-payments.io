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
   * @param manifest the payment app's manifest.
   */
  service.install = function(manifest) {
    // TODO: validate `manifest`
    if(!manifest || typeof manifest !== 'object') {
      throw new Error('manifest must be an object.');
    }
    storage.insert(manifest);
  };

  /**
   * Gets all app manifests that match the given options.
   *
   * @param options the options to use:
   *          paymentRequest the payment request to match.
   *
   * @return a map of matching acceptable payment and app manifests, keyed by
   *           app ID.
   */
  service.match = function(options) {
    options = options || {};
    if(!options.paymentRequest || !angular.isObject(options.paymentRequest)) {
      throw new Error('options.paymentRequest must be an object.');
    }

    // get acceptable payment
    var acceptable = jsonld.getValues(
      options.paymentRequest, 'acceptablePayment');

    // return all manifests whose supported payment methods intersect with
    // the acceptable payment methods
    var manifests = storage.getAll();
    var matches = {};
    for(var id in manifests) {
      var manifest = manifests[id];
      var supported = jsonld.getValues(manifest, 'supportedPaymentMethod');
      var intersection = _.filter(acceptable, function(x) {
        return supported.indexOf(x.paymentMethod) !== -1;
      });
      if(intersection.length > 0) {
        matches[manifest.id] = {
          manifest: manifest,
          acceptablePayment: intersection
        };
      }
    }
    return matches;
  };

  var storage = service.apps = {};

  /**
   * Inserts an app manifest into storage.
   *
   * @param manifest the payment app's manifest.
   */
  storage.insert = function(manifest) {
    if(!manifest || typeof manifest !== 'object') {
      throw new Error('manifest must be a valid object.');
    }
    var manifests = storage.getAll({});
    manifests[manifest.id] = manifest;
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
    var manifests = localStorage.getItem(STORAGE_KEYS.APPS);
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
