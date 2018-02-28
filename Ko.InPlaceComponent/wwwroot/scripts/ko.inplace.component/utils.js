define('ko.inplace.component/utils', function(require) {
    const ko = require('ko');
    const $ = require('jquery');    
    
    const cloneNodes = function (nodesArray, shouldCleanNodes) {
        for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
            var clonedNode = nodesArray[i].cloneNode(true);
            newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
        }
        return newNodesArray;
    };

    const emptyDomNode = function (domNode) {
        while (domNode.firstChild) {
            ko.removeNode(domNode.firstChild);
        }
    };

    const state = function(name, element, value) {
        if (!!value)
            $(element).data(name, value);
        else
            return $(element).data(name);
    }

    const nodes = state.bind(null, 'inplace-component-nodes');
    
    const modelClass = state.bind(null, 'inplace-component-model-class');

    const model = state.bind(null, 'inplace-component-model');

    const safeCreateModel = function(modelClass, params, trackParams) {
        const func = () => new modelClass(params);
        return !!trackParams && ko.unwrap(trackParams) ? func() : ko.ignoreDependencies(func);
    };    

    return {
        cloneNodes : cloneNodes,
        emptyDomNode: emptyDomNode,
        nodes: nodes,
        modelClass: modelClass,
        model: model,
        safeCreateModel: safeCreateModel
    };

});