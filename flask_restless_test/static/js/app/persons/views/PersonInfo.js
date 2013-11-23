define(function (require) {
    'use strict';
    var _ = require('underscore'),
        ModalView = require('app/base/views/ModalView'),
        personInfoTemplate = require('text!/static/templates/persons/person-info.html');
    return ModalView.extend({
        template: _.template(personInfoTemplate),
        modalSelector: '#person-info',
        backUrl: function () {
            var paramsString = window.location.search.substr(1),
                paramsArr = paramsString.split('&'),
                params = _(paramsArr).map(function (param) {
                    return param.split('=');
                }).zipObject().value();
            return params.back || '/person';
        }
    });
});
