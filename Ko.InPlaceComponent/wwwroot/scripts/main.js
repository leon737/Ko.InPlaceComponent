requirejs.config({
    baseUrl: "scripts",
    paths: {
        ko: "../lib/knockout/dist/knockout",
        lodash: "../lib/lodash/dist/lodash",
        domReady: '../lib/requirejs-domReady/domReady',
        jquery: "../lib/jquery/dist/jquery",
        q: "../lib/q/q",
        "collections/shim": "../lib/es6-shim/es6-shim",
        text: '../lib/requirejs-text/text'
    }
});

requirejs(["domReady", "application"]);