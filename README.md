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

### Subscribed messages
