define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        moment = require('moment');
    return Backbone.Model.extend({
        urlRoot: '/api/computer',

        getPurchaseTimeFormatted: function () {
            var purchaseTime = this.get('purchase_time');
            if (!purchaseTime) {
                return '-';
            }
            return moment(purchaseTime).format('DD MMM YYYY HH:mm');
        },

        getPurchaseTime: function () {
            return moment(this.get('purchase_time')).toDate();
        },

        getOwnerName: function () {
            var owner = this.get('owner');
            if (!owner) {
                return '-';
            }
            return owner.name;
        },

        getOwnerId: function () {
            return this.get('owner').id;
        }

    });
});
