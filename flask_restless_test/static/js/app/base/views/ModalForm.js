define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        AjaxChosen = require('app/base/views/AjaxChosen');
    return Backbone.View.extend({
        el: 'body',

        events: {
            'hide.bs.modal .modal': 'goBack',
            'hidden.bs.modal .modal': 'removeElement',
            'shown.bs.modal .modal': 'initSelects',
            'submit .modal form': 'saveModel'
        },

        render: function () {
            var $addEditModal = this.$el.append(this.template({
                model: this.model
            })).find(this.modalSelector);
            $addEditModal.modal();
            return this.initFields();
        },

        initSelects: function () {
            this.$('select').each(function () {
                new AjaxChosen({
                    el: this
                }).render();
            });
            return this;
        },

        $: function (selector) {
            return this.$el.find(this.modalSelector).find(selector);
        },

        goBack: function (evt) {
            if (evt && !$(evt.target).is(this.modalSelector)){
                return this;
            }
            window.history.back();
            return this;
        },

        removeElement: function () {
            this.undelegateEvents();
            this.$el.find(this.modalSelector).remove();
            return this;
        },

        saveModel: function (evt) {
            if (evt) {
                evt.preventDefault();
            }
            this.model.save(this.getFormData(), {
                success: _.bind(function (model) {
                    this.trigger('model:saved', {
                        model: model
                    });
                }, this)
            });
            this.$el.find(this.modalSelector).modal('hide');
            return this;
        }
    });
});
