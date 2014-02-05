define(function (require) {
    'use strict';
    var _ = require('underscore'),
        BaseItemView = require('app/base/views/Item'),
        computerItemTemplate = require('text!templates/computers/computer-item.html');
    return BaseItemView.extend({
        template: _.template(computerItemTemplate),
        className: 'computer-item',

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
            this.$('.computer-purchase-time')
                .text(this.model.getPurchaseTimeFormatted())
                .tomato();
            return this;
        }
    });
});
