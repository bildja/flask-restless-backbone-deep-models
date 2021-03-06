define(function (require) {
    'use strict';
    var Backbone = require('deep-model'),
        moment = require('moment');
    return Backbone.DeepModel.extend({
        urlRoot: '/api/person',

        getBirthDate: function () {
            var birthDate = this.get('birth_date');
            if (!birthDate){
                return '-';
            }
            return moment(birthDate).format('DD MMM YYYY');
        },

        getComputersCount: function () {
            var computers = this.get('computers'),
                computersCount = this.get('computers_count');
            if (computersCount) {
                return computersCount;
            }
            return computers ? computers.length : 0;
        },

        increaseComputersCount: function () {
            this.set('computers_count', this.get('computers_count') + 1);
            return this;
        },

        decreaseComputersCount: function () {
            this.set('computers_count', this.get('computers_count') - 1);
            return this;
        }
    });
});
