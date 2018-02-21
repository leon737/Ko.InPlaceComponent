define(function(require) {
    const ko = require('ko');
    
    let version = 0;

    const model = function(params) {
        this.name = ko.observable(params.name());
        this.version = version++;
    };

    return model;
});