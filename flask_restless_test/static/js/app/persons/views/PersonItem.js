define(function (require) {
    'use strict';
    var _ = require('underscore'),
        BaseItemView = require('app/base/views/Item'),
        personItemTemplate = require('text!templates/persons/person-item.html');
    return BaseItemView.extend({
        template: _.template(personItemTemplate)
    });
});
