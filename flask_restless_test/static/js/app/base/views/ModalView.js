define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');
    return Backbone.View.extend({
        el: 'body',
        events: {
            'hide.bs.modal .modal': 'goBack',
            'hidden.bs.modal .modal': 'removeElement'
        },

        initialize: function (options) {
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

        $: function (selector) {
            return this.$el.find(this.modalSelector).find(selector);
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
            this.$el.find(this.modalSelector).remove();
            return this;
        },

        hideModal: function () {
            this.$el.find(this.modalSelector).modal('hide');
            return this;
        }

    });
});
