//path difinition
module.exports = {
    assets: {
        jquery     : './node_modules/jquery/dist',
        easing     : './node_modules/jquery.easing',
        bootstrap  : './node_modules/bootstrap-honoka/dist/js',
        bowser     : './node_modules/bowser'
    },
    src: {
        ejs        : './src/ejs',
        scss       : './src/scss',
        assets     : '/assets',
        js         : './src/js',
        img        : './src/img',
        favicon    : './src/favicon'
    },
    config: {
        dir        : './src/config',
        config     : '/config.yml',
        commonvar  : '/commonvar.yml',
        gulpconfig : '/gulpconfig.yml'
    },
    contents: {
        dir        : './src/contents'
    },
    dist: {
        html       : './dist',
        news       : './dist/news',
        articles   : './dist/news/articles',
        css        : './dist/css',
        js         : './dist/js',
        img        : './dist/img'
    },
    sg: {
        html       : './sg/dist',
        md         : './readme.md',
        css        : '../../dist/css',
        js         : '../../dist/js',
        img        : '../../dist/img',
        favicon    : '../../dist/favicon',
        canceller  : '../src/css',
        template   : './sg/src/ejs'
    }
};