define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');
    return Backbone.Collection.extend({
        page: 1,

        parse: function (data) {
            this.page = data.page;
            this.totalPages = data.total_pages;
            console.log(this.totalPages);
            return data.objects;
        },

        fetch: function (options) {
            options = options || {};
            options.data = options.data || {};
            _.extend(options.data, {
                page: this.page
            });
            return Backbone.Collection.prototype.fetch.call(this, options);
        },

        setPage: function (page, fetch) {
            this.page = page || 1;
            if (fetch) {
                this.fetch();
            }
            return this;
        }
    });
});
