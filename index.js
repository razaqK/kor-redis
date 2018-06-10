const redis = require('redis');
const _createClient = Symbol('createClient');
const _select = Symbol('select');

class Redis {
    constructor(host, port, db) {
        this[_createClient](port, host)
        this[_select](db)
    }

    [_createClient](port, host) {
        this.client = redis.createClient(port, host)
    }

    [_select](db) {
        this.client.select(db)
    }

    set(key, value, ttl) {
        if (value instanceof Object || value instanceof Array) {
            value = JSON.stringify(value)
        }
        this.client.set(key, value);

        if (ttl) {
            this.client.expire(key, ttl);
        }
    }

    get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, function (err, data) {
                if (!err && data) {
                    try {
                        return resolve(JSON.parse(data))
                    }
                    catch (error) {
                        return resolve(data);
                    }
                }

                return resolve(false);
            });
        })
    }

    del(key) {
        this.client.del(key);
    }

    delAll() {
        return new Promise((resolve, reject) => {
            this.getKeys().then(keys => {
                keys.forEach(key => {
                    this.del(key)
                });

                return resolve(true);
            }).catch(err => {
                return reject(false);
            })
        })
    }

    getKeys() {
        return new Promise((resolve, reject) => {
            this.client.keys('*', (err, keys) => {
                if (err) {
                    return reject(false);
                }

                return resolve(keys)
            })
        })
    }

}

module.exports = Redis;