The `kor-redis` library exported as ```NodeJS``` module.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

# Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):
```
   $ npm i npm
   $ npm i --save kor-redis
```

In NodeJS

```
// Load pmodule
const Redis = require('kor-redis');
const redis = new Redis('host', 'port', 'db');

// setting value. Note value can be an object, an array, string or number
redis.set(key, value)

// setting value and expiring time. Note value can be an object, an array, string or number
redis.set(key, value, 5) // this expires in 5s

// get value store in redis
redis.get(key).then(value => {
    console.log(value)
})

// get all keys in redis
redis.getKeys().then(keys => {
    console.log(keys)
})

// delete key in redis
redis.del(key)

// delet all keys in redis
redis.delAll()
```

See the [package source](https://github.com/razaqK/kor-redis) for more detail.