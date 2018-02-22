define(function (require) {
    const utils = require('ko.inplace.component/utils');
    const ko = require('ko');

    const init = function () {
        ko.bindingHandlers.inplaceComponent = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                const value = ko.unwrap(valueAccessor());
                const componentName = value.name;
                const params = value.params;
                const trackParams = value.trackParams;
                const templateFileName = value.template || 'template.html';
                const modelFileName = value.model || 'model';
                require([`text!${componentName}/${templateFileName}`], template => {
                    const parsed = ko.utils.parseHtmlFragment(template);
                    utils.nodes(element, parsed);
                });
                require([`${componentName}/${modelFileName}`], modelClass => {
                    utils.modelClass(element, { modelClass: modelClass, params: params, trackParams: trackParams });
                })
                return { 'controlsDescendantBindings': true };
            },
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                const value = ko.unwrap(valueAccessor());
                const componentActive = ko.unwrap(value.active);
                const disposeModel = updateElement => {
                    const model = utils.model(element);
                    const dispose = !!model && model.dispose;
                    if (!!dispose && typeof dispose === 'function') {
                        dispose.call(model);
                    }
                    if (updateElement)
                        utils.model(element, null);
                };
                if (componentActive) {
                    disposeModel(false);
                    const savedNodes = utils.nodes(element);
                    const nodes = utils.cloneNodes(savedNodes);
                    ko.virtualElements.setDomNodeChildren(element, nodes);
                    const modelClass = utils.modelClass(element);
                    const model = utils.safeCreateModel(modelClass.modelClass, modelClass.params, modelClass.trackParams);
                    const childContext = bindingContext.createChildContext(model);
                    utils.model(element, model);
                    ko.applyBindingsToDescendants(childContext, element);
                }
                else {
                    utils.emptyDomNode(element);
                    disposeModel(true);
                }
            }
        };
    };

    return {
        init: init
    };
});