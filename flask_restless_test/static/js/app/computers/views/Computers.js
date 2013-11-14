define(function (require) {
    'use strict';
    var _ = require('underscore'),
        computersTemplate = require('text!/static/templates/computers/computers.html'),
        ComputerItemView = require('app/computers/views/ComputerItem'),
        CollectionView = require('app/base/views/Collection');
    return CollectionView.extend({
        template: _.template(computersTemplate),
        ItemView: ComputerItemView,
        baseUrl: '/computer/'
    });
});
