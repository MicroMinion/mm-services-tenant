'use strict'

var chai = require('chai')
var expect = chai.expect
var _ = require('lodash')

var TenantService = require('../index.js')

describe('mm-services-tenant', function () {
  describe('constructor', function () {
    it('should define TenantService class', function () {
      expect(_.isFunction(TenantService)).to.be.true
    })
  })
})
