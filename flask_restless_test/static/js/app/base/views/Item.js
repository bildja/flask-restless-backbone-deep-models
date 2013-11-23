define(function (require) {
    'use strict';
    var Backbone = require('backbone');
    $.fn.tomato = function () {
        this.addClass('tomato');
        setTimeout(_.bind(function () {
            this.removeClass('tomato');
        }, this), 3000);
    };
    return Backbone.View.extend({
        tagName: 'tr',
        nameField: 'name',

        events: {
            'click .delete-item': 'deleteItem'
        },

        initialize: function () {
            this.listenTo(this.model, 'change:owner.name', this.renderOwner);
            this.listenTo(this.model, 'change:name', this.renderName);
            this.listenTo(this.model, 'change:vendor', this.renderVendor);
            this.listenTo(this.model, 'change:purchase_time', this.renderPurchaseTime);
        },

        renderOwner: function () {
            var $computerOwner = this.$('.computer-owner'),
                $ownerLink = $computerOwner.find('a');
            if (!$ownerLink.length) {
                $ownerLink = $('<a></a>').appendTo($computerOwner);
            }
            $ownerLink
                    .attr('href', '/person/edit/' + this.model.get('owner').id)
                    .text(this.model.getOwnerName());
            $computerOwner.tomato();
            return this;
        },

        renderName: function () {
            this.$('.computer-name')
                .text(this.model.get('name'))
                .tomato();
            return this;
        },

        renderVendor: function () {
            this.$('.computer-vendor')
                .text(this.model.get('vendor'))
                .tomato();
            return this;
        },

        renderPurchaseTime: function () {
            console.log(arguments);
            this.$('.computer-purchase-time')
                .text(this.model.getPurchaseTimeFormatted())
                .tomato();
            return this;
        },

        render: function () {
            if (this.model.get('id') === 29) {
//                debugger;
            }
            this.$el.html(this.template({
                model: this.model
            }));
            return this;
        },

        deleteItem: function () {
            if (!confirm("You want to delete " + this.model.get(this.nameField) + "?")){
                return this;
            }
            this.model.destroy({
                success: function () {
                    this.$el.fadeOut();
                }.bind(this)
            });
            return this;
        }
    });
});
