const redis = require('redis');

function _createClient(port, host) {
    this.client = redis.createClient(port, host)
}

function _select(db) {
    this.client.select(db)
}

function _stringifyIfJson(value) {
    if (value instanceof Object || value instanceof Array) {
        value = JSON.stringify(value)
    }

    return value;
}

class Redis {
    constructor(host, port, db) {
        this.client = null;

        _createClient.call(this, port, host);
        _select.call(this, db);
    }
}

Redis.prototype.set = function (key, value, ttl) {
    value = _stringifyIfJson.call(this, value)
    this.client.set(key, value);

    if (ttl) {
        this.client.expire(key, ttl);
    }
};

Redis.prototype.get = async function (key) {
    return await new Promise((resolve, reject) => {
        this.client.get(key, function (err, data) {
            if (err || !data) {
                return resolve(false);
            }

            try {
                return resolve(JSON.parse(data))
            }
            catch (error) {
                return resolve(data);
            }
        });
    })
};

Redis.prototype.del = function (key) {
    this.client.del(key);
};

Redis.prototype.delAll = async function () {
    return this.getKeys().then(keys => {
        keys.forEach(key => {
            this.del(key)
        });

        return true;
    }).catch(err => {
        return false;
    })
};

Redis.prototype.getKeys = async function () {
    return await new Promise((resolve, reject) => {
        this.client.keys('*', (err, keys) => {
            return resolve(!err ? keys : false)
        })
    })
};

/**
 * @description get the remaining expiration of a key in seconds
 * @param key
 * @returns {Promise<any>}
 */
Redis.prototype.remainExpiryTimeInSeconds = async function (key) {
    return await _processSingleCommand.call(this, {name: 'ttl', key: key});
}

/**
 * @description get the remaining expiration of a key in milliseconds
 * @param key
 * @returns {Promise<any>}
 */
Redis.prototype.remainExpiryTimeInMilliSeconds = async function (key) {
    return await _processSingleCommand.call(this, {name: 'pttl', key: key});
}

/**
 * @description check if a key exist
 * @param key
 * @returns {Promise<any>}
 */
Redis.prototype.exist = async function (key) {
    return await _processSingleCommand.call(this, {name: 'exists', key: key});
}

/**
 * @description as the name suggest. It is use to change key name.
 * @param key
 * @param new_key
 * @returns {Promise<any>}
 */
Redis.prototype.renameKey = async function (key, new_key) {
    return await _processCommand.call(this, {name: 'rename', key: key, value: new_key});
}

/**
 * @description remove expiration from key
 * @param key
 * @returns {Promise<*>}
 */
Redis.prototype.persist = async function (key) {
    return await _processSingleCommand.call(this, {name: 'persist', key: key});
}


/**
 * @description set new expiration (in milliseconds) on key
 * @param key
 * @returns {Promise<*>}
 */
Redis.prototype.setExpiryTimeInMilli = async function (key, time) {
    return await _processCommand.call(this, {name: 'pexpire', key: key, value: time});
}

/**
 * @description set new expiration (in seconds) on key
 * @param key
 * @param time
 * @returns {Promise<*>}
 */
Redis.prototype.setExpiryTime = async function (key, time) {
    return await _processCommand.call(this, {name: 'expire', key: key, value: time});
}

/**
 * @description process redis singleton commands
 * @param options
 * @returns {Promise<any>}
 * @private
 */
async function _processSingleCommand(options) {
    return await new Promise((resolve, reject) => {
        if (!options || typeof options !== 'object') {
            resolve(false)
        }

        this.client[options.name](options.key, function (err, key) {
            try {
                return resolve(key)
            } catch (e) {
                return resolve(false)
            }
        });
    })
}

/**
 * @description process redis sets commands
 * @param options
 * @returns {Promise<any>}
 * @private
 */
async function _processCommand(options) {
    return await new Promise((resolve, reject) => {
        if (!options || typeof options !== 'object') {
            resolve(false)
        }

        this.client[options.name](options.key, options.value, function (err, key) {
            try {
                if (err) {
                    return resolve(false)
                }

                return resolve(key === 'OK' ? true : key)
            } catch (e) {
                return resolve(false)
            }
        });
    })
}



module.exports = Redis;