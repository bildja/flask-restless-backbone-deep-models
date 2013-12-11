define(function (require) {
    'use strict';
    var _ = require('underscore'),
        Backbone = require('backbone');
    return Backbone.Collection.extend({

        parse: function (data) {
            this.page = data.page;
            this.totalPages = data.total_pages;
            return data.objects;
        },

        fetch: function (options) {
            options = options || {};
            options.data = options.data || {};
            _.extend(options.data, {
                page: this.page || 1
            });
            return Backbone.Collection.prototype.fetch.call(this, options);
        },

        setPage: function (options) {
            options = options || {};
            var page = parseInt(options.page || 1, 10);
            if (page === this.page && !options.force) {
                return this;
            }
            this.page = page;
            this.trigger('page:change', {
                            page: page
                        });
            if (options.fetch) {
                this.fetch({
                    success: function () {

                    }.bind(this)
                });
            }
            return this;
        }
    });
});
