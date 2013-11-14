define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        BaseCollection = require('app/base/collections/BaseCollection'),
        Person = require('app/persons/models/Person');
    return BaseCollection.extend({
        model: Person,
        url: '/api/person'
    });
});
