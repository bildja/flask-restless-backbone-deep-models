define(function (require) {
    'use strict';
    var _ = require('underscore'),
        Backbone = require('backbone'),
        PaginationView = require('app/base/views/Pagination');
    return Backbone.View.extend({
        el: '#content',

        initialize: function () {
            this.collection.on('sync', this.showCollection, this);
        },

        render: function () {
            var $el = this.$el;
            $el.html(this.template({
                collection: this.collection
            }));
            return this.showCollection().renderPaging();
        },

        showCollection: function () {
            var $tbody = this.$el.find('#list-tbody').empty();
            if (this.collection.length && !$tbody.length){
                return this.render();
            }
            this._itemViews = [];
            this.collection.each(_.bind(function (model) {
                var itemView = new this.ItemView({
                    model: model
                }).render();
                this._itemViews.push(itemView);
                $tbody.append(itemView.el);
            }, this));
            return this;
        },

        renderPaging: function () {
            new PaginationView({
                el: this.$('.pagination'),
                collection: this.collection,
                baseUrl: this.baseUrl
            }).render();
            return this;
        }
    });
});
