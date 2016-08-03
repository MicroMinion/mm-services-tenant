# mm-services-tenant

Tenant service to create and manage TenantService

works with [MicroMinion platform](https://github.com/MicroMinion/mm-platform)

[![CircleCI](https://circleci.com/gh/MicroMinion/mm-services-tenant.svg?style=svg)](https://circleci.com/gh/MicroMinion/mm-services-tenant)

## Initialization

```js
var MicroMinionPlatform = require('mm-platform')
var TenantService = require('mm-services-tenant')
var kadfs = require('kad-fs')
var path = require('path')

var storageDir = './data'

var platform = new MicroMinionPlatform({
  storage: kadfs(path.join(storageDir, 'platform'))
})

var kademlia = new TenantService({
  platform: platform,
})
```

## Messaging API

### Data structures

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
