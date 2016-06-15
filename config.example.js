var config = {
    
    site: {
        port: 80
    },

    path: {
        views: '/application/views/'
    },

    database: {
        url: "mongodb://127.0.0.1/market",
        port: 27017
    },

    session: {
        secret: 'hellomarket',
        maxage: 7 * 24 * 60 * 60 * 1000
    }
    
};

module.exports = config;