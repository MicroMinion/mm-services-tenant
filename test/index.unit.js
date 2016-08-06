'use strict'

var chai = require('chai')
var expect = chai.expect
var _ = require('lodash')
var winston = require('winston')

var PlatformStub = require('mm-platform-stub')
var TenantService = require('../index.js')

describe('mm-services-tenant', function () {
  describe('constructor', function () {
    it('should define TenantService class', function () {
      expect(_.isFunction(TenantService)).to.be.true
    })
    it('should create TenantService class with platform and logger parameter', function () {
      var platform = new PlatformStub()
      var tenantService = new TenantService({
        platform: platform,
        logger: winston
      })
      expect(tenantService).to.be.an('object')
      expect(tenantService).to.have.property('platform')
      expect(tenantService.platform).to.equal(platform)
      expect(tenantService).to.have.property('_log')
      expect(tenantService._log).to.equal(winston)
    })
  })
/*
            describe('create', function() {
                describe('receive create', function() {
                    var nodeA = new TenantService({
                        platform: new PlatformStub({
                            identity: 'nodeA'
                        }),
                        logger: winston
                    })
                    var nodeB = new TenantService({
                        platform: new PlatformStub({
                            identity: 'nodeB'
                        }),
                        logger: winston
                    })
                })
                */
})
