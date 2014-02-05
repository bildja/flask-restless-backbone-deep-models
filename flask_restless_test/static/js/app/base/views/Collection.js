define(function (require) {
    'use strict';
    var Backbone = require('backbone'),
        PaginationView = require('app/base/views/Pagination');
    return Backbone.View.extend({
        el: '#content',
        isRendered: false,

        initialize: function () {
            var collection = this.collection;
            this.listenTo(collection, 'sync', this.renderPaging);
            this.listenTo(collection, 'add', this.renderItem);
            this.listenTo(collection, 'page:change', this.renderCollectionPage);
        },

        renderCollectionPage: function () {
            var $el = this.$el;
            $el.html(this.template({
                collection: this.collection
            }));
            var isRendered = !!this.collection.length;
            $el.find('.items-list').toggle(isRendered)
                .end()
                .find('.no-items').toggle(!isRendered);
            this.isRendered = isRendered;
            return this;
        },

        render: function () {
            if (this.isRendered) {
                return this;
            }
            this.renderCollectionPage();
            return this.showCollection().renderPaging();
        },

        renderItem: function (model) {
            if (!this.isRendered) {
                this.renderCollectionPage();
            }
            var itemView = new this.ItemView({
                model: model
            }).render();
            this._itemViews.push(itemView);
            this.$getTBody().append(itemView.el);
            return this;
        },

        $getTBody: function () {
            return this.$('#list-tbody');
        },

        undelegateEvents: function () {
            this.stopListening();
            return Backbone.View.prototype.undelegateEvents.apply(this, arguments);
        },

        showCollection: function () {
            var $tbody = this.$getTBody().empty();
            if (this.collection.length && !$tbody.length){
                return this.render();
            }
            this._itemViews = [];
            this.collection.each(this.renderItem, this);
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
