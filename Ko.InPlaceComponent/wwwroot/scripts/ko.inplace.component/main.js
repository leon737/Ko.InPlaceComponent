define(function (require) {
    const ko = require('ko');
    const $ = require('jquery');

    const utils = {};

    utils.cloneNodes = function (nodesArray, shouldCleanNodes) {
        for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
            var clonedNode = nodesArray[i].cloneNode(true);
            newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
        }
        return newNodesArray;
    };

    utils.emptyDomNode = function (domNode) {
        while (domNode.firstChild) {
            ko.removeNode(domNode.firstChild);
        }
    };

    utils.nodes = function(element, value) {
        const name = 'inplace-component-nodes';
        if (!!value)
            $(element).data(name, value);
        else
            return $(element).data(name);
    }
    
    utils.modelClass = function(element, value) {
        const name = 'inplace-component-model-class';
        if (!!value)
            $(element).data(name, value);
        else
            return $(element).data(name);
    }

    utils.safeCreateModel = function(modelClass, params, trackParams) {
        const func = () => new modelClass(params);
        return !!trackParams && ko.unwrap(trackParams) ? func() : ko.ignoreDependencies(func);
    }

    const init = function () {
        ko.bindingHandlers.inplaceComponent = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                const value = ko.unwrap(valueAccessor());
                const componentName = value.name;
                const params = value.params;
                const trackParams = value.trackParams;
                require([`text!${componentName}/template.html`], template => {
                    const parsed = ko.utils.parseHtmlFragment(template);
                    utils.nodes(element, parsed);
                });
                require([`${componentName}/model`], modelClass => {
                    utils.modelClass(element, {modelClass: modelClass, params: params, trackParams: trackParams});
                })
                return { 'controlsDescendantBindings': true };
            },
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                const value = ko.unwrap(valueAccessor());
                const componentActive = ko.unwrap(value.active);
                if (componentActive) {
                    const savedNodes = utils.nodes(element);
                    const nodes = utils.cloneNodes(savedNodes);
                    ko.virtualElements.setDomNodeChildren(element, nodes);
                    const modelClass = utils.modelClass(element);
                    const model = utils.safeCreateModel(modelClass.modelClass, modelClass.params, modelClass.trackParams);
                    const childContext = bindingContext.createChildContext(model);
                    ko.applyBindingsToDescendants(childContext, element);
                }
                else {
                    utils.emptyDomNode(element);
                }
            }
        };
    };

    return {
        init: init
    };
});