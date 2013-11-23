define(function (require) {
    'use strict';
    var _ = require('underscore'),
        Backbone = require('backbone'),
        moment = require('moment');
    return Backbone.Model.extend({

        defaults: function () {
            return {
                created_at: moment().format('YYYY-MM-DDTHH:mm:ss')
            }
        },

        createdAtFormatted: function () {
            return moment(this.get('created_at')).format('DD MMM YYYY HH:mm');
        }
    });
});
