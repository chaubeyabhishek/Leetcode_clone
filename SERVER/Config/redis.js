const redis = require('redis');
const {createClient} = require('redis');


const redisClient = redis.createClient({
    username: 'default',
    password:  process.env.REDIS_PASS,
    socket: {
        host: 'space-top-compact-69420.db.redis.io',
        port: 19674
    }

});

module.exports = redisClient;

