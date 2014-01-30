define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');
    return Backbone.View.extend({
        el: 'body',
        events: {
            'hide.bs.modal .modal': 'onModalHide',
            'hidden.bs.modal .modal': 'removeElement'
        },

        onModalHide: function () {
            this.goBack.apply(this, arguments);
            return this;
        },

        initialize: function (options) {
            options = options || {};
            if (options.backUrl) {
                this.backUrl = options.backUrl;
            }
            return this;
        },

        render: function () {
            var $modal = this.$el.append(this.template({
                model: this.model
            })).find(this.modalSelector);
            $modal.modal();
            return this;
        },

        findModal: function () {
            return this.$el.find(this.modalSelector);
        },

        $: function (selector) {
            return this.findModal().find(selector);
        },

        goBack: function (evt) {
            if (evt && !$(evt.target).is(this.modalSelector)){
                return this;
            }
            Backbone.history.navigate(_.result(this, 'backUrl'), {
                trigger: true
            });
            return this;
        },

        removeElement: function () {
            this.undelegateEvents();
            this.findModal().remove();
            return this;
        },

        hideModal: function () {
            this.findModal().modal('hide');
            return this;
        }

    });
});
