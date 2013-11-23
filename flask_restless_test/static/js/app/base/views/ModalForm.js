define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        ModalView = require('app/base/views/ModalView'),
        AjaxChosen = require('app/base/views/AjaxChosen');
    return ModalView.extend({

        events: _.extend({
            'shown.bs.modal .modal': 'initSelects',
            'submit .modal form': 'saveModel'
        }, ModalView.prototype.events),

        render: function () {
            ModalView.prototype.render.apply(this, arguments);
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
            return this.hideModal();
        }
    });
});
