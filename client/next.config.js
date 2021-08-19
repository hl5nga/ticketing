module.exports = { 
    webpackDevMiddleWare: config => { 
        config.watchOptions.pull = 300; 
        return config;
    }
};