define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        moment = require('moment');
    return Backbone.Model.extend({
        urlRoot: '/api/person',

        getBirthDate: function () {
            var birthDate = this.get('birth_date');
            if (!birthDate){
                return '-';
            }
            return moment(birthDate).format('DD MMM YYYY');
        }
    });
});
