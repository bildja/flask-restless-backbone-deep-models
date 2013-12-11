define(function (require) {
    'use strict';
    var BaseCollection = require('app/base/collections/BaseCollection'),
        Person = require('app/persons/models/Person'),
        Backbone = require('backbone-mediator');
    return BaseCollection.extend({
        model: Person,
        url: '/api/people',

        initialize: function () {
            Backbone.Mediator.sub('destroy:computer', this.decreasePersonComputersCount, this);
            return this;
        },

        decreasePersonComputersCount: function (options) {
            var computer = options.computer,
                person = this.get(computer.get('owner_id'));
            if (person) {
                person.decreaseComputersCount();
            }
            return this;
        }
    });
});
