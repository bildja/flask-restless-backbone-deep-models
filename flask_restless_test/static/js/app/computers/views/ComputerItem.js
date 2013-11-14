define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        BaseItemView = require('app/base/views/Item'),
        computerItemTemplate = require('text!/static/templates/computers/computer-item.html');
    return BaseItemView.extend({
        template: _.template(computerItemTemplate),
        className: 'computer-item'
    });
});
