define(function(require){
    const ko = require('ko');
    const inplaceComponentBinding = require('ko.inplace.component/binding');
    
    inplaceComponentBinding.init();
   
    const model = new(function() {
        
        this.componentActive = ko.observable(false);
        this.name = ko.observable('John');
        this.age = ko.observable(30);
        this.trackParams = ko.observable(false);

        this.componentOptions = {
            name: 'mycomponent',
            active: this.componentActive,
            params: {
                name: this.name,
                age: this.age
            },
            trackParams: this.trackParams
        };

    });

    ko.applyBindings(model);

});