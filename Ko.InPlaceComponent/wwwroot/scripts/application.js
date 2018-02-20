define(function(require){
    const ko = require('ko');
    const inplaceComponentBinding = require('ko.inplace.component/main');
    
    inplaceComponentBinding.init();
   
    const model = new(function() {
        
        this.componentActive = ko.observable(false);

        this.componentOptions = {
            name: 'mycomponent',
            active: this.componentActive
        };

    });

    ko.applyBindings(model);

});