The `kor-redis` library exported as ```NodeJS``` module.


# Installation

Using npm
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

See the [package source](https://github.com/razaqK/redis_util) for more detail.