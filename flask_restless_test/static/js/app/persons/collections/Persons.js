define(function (require) {
    'use strict';
    var BaseCollection = require('app/base/collections/BaseCollection'),
        Person = require('app/persons/models/Person');
    return BaseCollection.extend({
        model: Person,
        url: '/api/people'
    });
});
