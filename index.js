'use strict'

var assert = require('assert')
var _ = require('lodash')
var identityHelpers = require('mm-create-identity')

var TenantService = function (options) {
  assert(_.isObject(options))
  assert(_.isObject(options.runtime))
  assert(_.isObject(options.platform))
  assert(_.isFunction(options.runtimeClass))
  assert(_.isObject(options.storage))
  assert(_.isString(options.secret))
  assert(_.isObject(options.logger))
  this._log = options.logger
  this._secret = options.secret
  this._runtime = options.runtime
  this._runtimeClass = options.runtimeClass
  this._storage = options.storage
  this._platform = options.platform
  this._tenants = {}
  this.platform.messaging.on('public.tenant.create', this._onCreate.bind(this))
  this._loadTenants()
  this._ready = false
}

TenantService.prototype._loadTenants = function () {
  var self = this
  this.storage.get('tenants', function (err, result) {
    if (!err) {
      var tenants = JSON.parse(result)
      _.forEach(tenants, function (tenant) {
        var environment = {}
        if (self._runtime._hasPersistence()) {
          environment.PERSISTENCE = self._runtime.appendToPersistence(tenant)
        }
        var runtime = new self._runtimeClass(environment)
        runtime.createPlatform()
        runtime.platform.on('ready', function () {
          runtime.createService('serviceManager')
        })
        self._tenants[tenant] = runtime
      })
    }
    self._ready = true
  })
}

TenantService.prototype._saveTenants = function () {
  this.storage.put('tenants', JSON.stringify(_.keys(this._tenants)))
}

TenantService.prototype._validMessage = function (data) {
  return this._ready &&
    _.isObject(data) &&
    _.isString(data.secret) &&
    data.secret === this._secret &&
    _.isString(data.id)
}

TenantService.prototype._onCreate = function (topic, publicKey, data) {
  if (this._validMessage(data)) {
    if (this._tenantExists(publicKey)) {
      var tenantKey = this._getTenantKey(publicKey)
      this.platform.messaging.send(publicKey, tenantKey, data.id)
    } else {
      this._createNewTenant(publicKey, data.id)
    }
  }
}

TenantService.prototype._getTenantKey = function (publicKey) {
  _.forEach(this._tenants, function (runtime, tenantKey) {
    if (runtime.services.devices.inScope(publicKey)) {
      return tenantKey
    }
  })
}

TenantService.prototype._tenantExists = function (publicKey) {
  return !_.isUndefined(this._getTenantKey(publicKey))
}

TenantService.prototype._sendReply = function (destination, tenantKey, id) {
  this.platform.messaging.send('tenant.createReply', destination, {
    id: id,
    publicKey: tenantKey
  })
}

TenantService.prototype._createNewTenant = function (publicKey, id) {
  var self = this
  var keyPair = identityHelpers.createKeyPair()
  var environment = {
    SERVICES: 'kademlia mdns serviceManager flukso devices',
    IDENTITY: keyPair.secretKey
  }
  if (this._runtime._hasPersistence()) {
    environment.PERSISTENCE = this._runtime.appendToPersistence(keyPair.publicKey)
  }
  var runtime = new this._runtimeClass(environment)
  runtime.createPlatform()
  runtime.platform.on('ready', function () {
    var tenantKey = runtime.platform.identity.getSignId()
    self._tenants[tenantKey] = runtime
    self._saveTenants()
    runtime.services.devices.addKey(publicKey)
    self._sendReply(publicKey, tenantKey, id)
  })
}

module.exports = TenantService
