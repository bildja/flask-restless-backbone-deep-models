define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        BaseItemView = require('app/base/views/Item'),
        personItemTemplate = require('text!/static/templates/persons/person-item.html');
    return BaseItemView.extend({
        template: _.template(personItemTemplate)
    });
});
