define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        CollectionView = require('app/base/views/Collection'),
        personsTemplate = require('text!/static/templates/persons/persons.html'),
        PersonItemView = require('app/persons/views/PersonItem');
    return CollectionView.extend({
        template: _.template(personsTemplate),
        ItemView: PersonItemView,
        baseUrl: '/person/'
    });
});
