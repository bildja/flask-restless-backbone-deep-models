define(function (require) {
    'use strict';
    var _ = require('underscore'),
        Backbone = require('backbone'),
        paginationTemplate = require('text!/static/templates/base/pagination.html');
    return Backbone.View.extend({
        template: _.template(paginationTemplate),

        initialize: function (options) {
            this.collection.on('sync', this.render, this);
            this.baseUrl = options.baseUrl;
        },

        render: function () {
            this.$el.html(this.template({
                collection: this.collection,
                baseUrl: this.baseUrl
            }));
            return this;
        }
    });
});
