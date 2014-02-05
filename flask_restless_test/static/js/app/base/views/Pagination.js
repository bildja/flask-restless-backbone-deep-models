define(function (require) {
    'use strict';
    var _ = require('underscore'),
        Backbone = require('backbone'),
        paginationTemplate = require('text!templates/base/pagination.html');
    return Backbone.View.extend({
        template: _.template(paginationTemplate),

        initialize: function (options) {
            if (!this.collection) {
                throw Error("the `collection` param is required");
            }
            this.collection.on('sync', this.render, this);
            this.baseUrl = options.baseUrl;
            if (!this.baseUrl) {
                throw Error("baseUrl is required");
            }
            if (this.baseUrl[this.baseUrl.length - 1] !== '/') {
                this.baseUrl = this.baseUrl + '/'
            }
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
