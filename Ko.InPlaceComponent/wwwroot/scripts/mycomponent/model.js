define(function(require) {
    const ko = require('ko');
    
    let version = 0;

    const model = function(params) {
        this.name = ko.observable(params.name());
        this.age = ko.observable(params.age.peek());
        this.version = version++;

        this.dispose = () => console.log(`dispose called, version=${this.version}`);
    };

    return model;
});