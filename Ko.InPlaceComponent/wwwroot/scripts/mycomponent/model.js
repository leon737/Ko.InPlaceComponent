define(function(require) {
    const ko = require('ko');

    const model = function() {
        this.name = ko.observable('John');
    };

    return model;
});