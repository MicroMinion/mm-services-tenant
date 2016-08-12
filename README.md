# mm-services-tenant

Tenant service to create and manage tenants on a node

works with [MicroMinion platform](https://github.com/MicroMinion/mm-platform)

[![CircleCI](https://circleci.com/gh/MicroMinion/mm-services-tenant.svg?style=svg)](https://circleci.com/gh/MicroMinion/mm-services-tenant)

## Initialization

```js
var MicroMinionPlatform = require('mm-platform')
var TenantService = require('mm-services-tenant')
var Runtime = require('mm-box')
var uuid = require('node-uuid')
var MemStore = require('kad-memstore')

var platform = new MicroMinionPlatform()
var runtime = new Runtime()
var runtimeClass = Runtime
var secret = uuid.v4()

var tenantService = new TenantService({
  platform: platform,
  runtime: runtime,
  runtimeClass: runtimeClass,
  secret: secret,
  storage: new MemStore(),
  logger: platform._log
})
```

## Messaging API

### Data structures

A tenant is identified by its public key. This service instantiates a runtime for each tenant.

### Published messages

#### public.tenant.createReply

Reply from remote host that new tenant is created

```js
var MicroMinionPlatform = require('mm-platform')

var platform = new MicroMinionPlatform({})
//publicKey is the publicKey of the remote host where we want to create a tenant on
//secret is the secret from QR code of that same host
//id is a unique identifier that is generated

platform.messaging.send('tenant.create', publicKey, {secret: secret, id: id})

platform.messaging.on('public.tenant.createReply', function(topic, sender, getReply) {
  if(id === getReply.id) {
    //publicKey of tentant that was created
    console.log(getReply.publicKey)
    platform.messaging.send('devices.add', 'local', getReply.publicKey)
  }
})
```

### Subscribed messages

#### public.tenant.create

Create new tenant on remote host

We assume that publicKey of remote host and secret is captured by scanning in QR code from physical host device

```js
var MicroMinionPlatform = require('mm-platform')

var platform = new MicroMinionPlatform({})
//publicKey is the publicKey of the remote host where we want to create a tenant on
//secret is the secret from QR code of that same host
//id is a unique identifier that is generated

platform.messaging.send('tenant.create', publicKey, {secret: secret, id: id})

platform.messaging.on('public.tenant.createReply', function(topic, sender, getReply) {
  if(id === getReply.id) {
    //publicKey of tentant that was created
    console.log(getReply.publicKey)
    platform.messaging.send('devices.add', 'local', getReply.publicKey)
  }
})
```
